import React, { useState, useContext, useEffect } from "react"
import { useRouter } from "next/router"
import {
  ApiClientContext,
  t,
  Form,
  AlertBox,
  AlertTypes,
  setSiteAlertMessage,
  LoadingOverlay,
  StatusBar,
  AppearanceStyleType,
  Button,
} from "@bloom-housing/ui-components"
import { useForm, FormProvider } from "react-hook-form"
import { HouseholdMember, Application, ApplicationStatus } from "@bloom-housing/backend-core/types"
import { mapFormToApi, mapApiToForm } from "../../../lib/formatApplicationData"
import { useSingleListingData } from "../../../lib/hooks"
import { FormApplicationData } from "./sections/FormApplicationData"
import { FormPrimaryApplicant } from "./sections/FormPrimaryApplicant"
import { FormAlternateContact } from "./sections/FormAlternateContact"
import { FormHouseholdMembers } from "./sections/FormHouseholdMembers"
import { FormHouseholdDetails } from "./sections/FormHouseholdDetails"
import { FormPreferences } from "./sections/FormPreferences"
import { FormHouseholdIncome } from "./sections/FormHouseholdIncome"
import { FormDemographics } from "./sections/FormDemographics"
import { FormTerms } from "./sections/FormTerms"

import { Aside } from "../Aside"
import { FormTypes } from "./FormTypes"

type ApplicationFormProps = {
  listingId: string
  application?: Application
  editMode?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ApplicationForm = ({ listingId, editMode, application }: ApplicationFormProps) => {
  const { listingDto } = useSingleListingData(listingId)

  const preferences = listingDto?.preferences

  const defaultValues = editMode ? mapApiToForm(application) : {}

  const formMethods = useForm<FormTypes>({
    defaultValues,
  })

  const router = useRouter()

  const { applicationsService } = useContext(ApiClientContext)

  const [alert, setAlert] = useState<AlertTypes | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [householdMembers, setHouseholdMembers] = useState<HouseholdMember[]>([])

  useEffect(() => {
    if (application?.householdMembers) {
      setHouseholdMembers(application.householdMembers)
    }
  }, [application, setHouseholdMembers])

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, trigger, clearErrors, reset } = formMethods

  const triggerSubmit = async (data: FormTypes) => onSubmit(data, "details")

  const triggerSubmitAndRedirect = async () => {
    const validation = await trigger()

    if (validation) {
      const data = formMethods.getValues()

      if (data) {
        void onSubmit(data, "new")
      }
    } else {
      onError()
    }
  }

  /*
    @data: form data comes from the react-hook-form
    @redirect: open application details or reset form
  */
  const onSubmit = async (data: FormTypes, redirect: "details" | "new") => {
    setAlert(null)
    setLoading(true)

    const formData = {
      householdMembers,
      ...data,
    }

    const body = mapFormToApi(formData, listingId)

    try {
      const result = editMode
        ? await applicationsService.update({
            applicationId: application.id,
            body: { id: application.id, ...body },
          })
        : await applicationsService.create({ body })

      setLoading(false)

      if (result) {
        setSiteAlertMessage(
          editMode
            ? t("application.add.applicationUpdated")
            : t("application.add.applicationSubmitted"),
          "success"
        )

        if (redirect === "details") {
          void router.push(`/application?id=${result.id}`)
        } else {
          reset()
          clearErrors()
          setAlert(null)
        }
      }
    } catch (err) {
      setAlert("alert")
      setLoading(false)
    }
  }

  const onError = () => {
    setAlert("alert")
  }

  async function deleteApplication() {
    try {
      await applicationsService.delete({ applicationId: application?.id })
      void router.push(`/listings/applications?listing=${listingId}`)
    } catch (err) {
      setAlert("alert")
    }
  }

  return (
    <LoadingOverlay isLoading={loading}>
      <>
        <StatusBar
          backButton={
            <Button
              inlineIcon="left"
              icon="arrow-back"
              onClick={() =>
                editMode ? router.push(`/application?id=${application.id}`) : router.back()
              }
            >
              {t("t.back")}
            </Button>
          }
          tagStyle={
            application?.status == ApplicationStatus.submitted
              ? AppearanceStyleType.success
              : AppearanceStyleType.primary
          }
          tagLabel={
            application?.status
              ? t(`application.details.applicationStatus.${application.status}`)
              : t(`application.details.applicationStatus.submitted`)
          }
        />

        <FormProvider {...formMethods}>
          <section className="bg-primary-lighter py-5">
            <div className="max-w-screen-xl px-5 mx-auto">
              {alert && (
                <AlertBox onClose={() => setAlert(null)} closeable type={alert}>
                  {t("application.add.applicationAddError")}
                </AlertBox>
              )}

              <Form id="application-form" onSubmit={handleSubmit(triggerSubmit, onError)}>
                <div className="flex flex-row flex-wrap">
                  <div className="info-card md:w-9/12">
                    <FormApplicationData />

                    <FormPrimaryApplicant />

                    <FormAlternateContact />

                    <FormHouseholdMembers
                      householdMembers={householdMembers}
                      setHouseholdMembers={setHouseholdMembers}
                    />

                    <FormHouseholdDetails />

                    <FormPreferences preferences={preferences} />

                    <FormHouseholdIncome />

                    <FormDemographics />

                    <FormTerms />
                  </div>

                  <aside className="md:w-3/12 md:pl-6">
                    <Aside
                      type={editMode ? "edit" : "add"}
                      listingId={listingId}
                      onDelete={() => deleteApplication()}
                      triggerSubmitAndRedirect={triggerSubmitAndRedirect}
                    />
                  </aside>
                </div>
              </Form>
            </div>
          </section>
        </FormProvider>
      </>
    </LoadingOverlay>
  )
}

export default ApplicationForm
