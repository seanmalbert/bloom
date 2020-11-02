import React, { Fragment, useMemo } from "react"
import { useRouter } from "next/router"
import moment from "moment"
import Head from "next/head"
import {
  PageHeader,
  t,
  Tag,
  GridSection,
  ViewItem,
  GridCell,
  MinimalTable,
  InlineButton,
} from "@bloom-housing/ui-components"
import { useSingleApplicationData } from "../../lib/hooks"
import Layout from "../../layouts/application"

export default function ApplicationsList() {
  const router = useRouter()

  const applicationId = router.query.applicationId as string

  const { applicationDto, applicationLoading, applicationError } = useSingleApplicationData(
    applicationId
  )

  const application = applicationDto?.application as Record<string, any>

  const applicationDate = useMemo(() => {
    if (!applicationDto) return null

    const momentDate = moment(applicationDto.createdAt)
    const date = momentDate.format("MM/DD/YYYY")
    const time = momentDate.format("HH:mm:ss A")

    return {
      date,
      time,
    }
  }, [applicationDto])

  const applicationUpdated = useMemo(() => {
    if (!applicationDto) return null

    const momentDate = moment(applicationDto.updatedAt)

    return momentDate.format("MMMM DD, YYYY")
  }, [applicationDto])

  const annualIncome = useMemo(() => {
    if (!application) return null

    const { income, incomePeriod } = application
    const annual = incomePeriod === "perMonth" ? income * 12 : income
    return `${annual.toFixed(2)}`
  }, [application])

  const householdMembersHeaders = {
    name: t("t.name"),
    relationship: t("t.relationship"),
    birth: t("application.household.member.dateOfBirth"),
    street: t("t.street"),
    city: t("application.contact.city"),
    state: t("application.contact.state"),
  }

  const householdMembersData = useMemo(() => {
    return application?.householdMembers.map((item) => ({
      name: `${item.firstName} ${item.middleName} ${item.lastName}`,
      relationship: t(`application.form.options.relationship.${item.relationship}`),
      birth: `${item.birthMonth}/${item.birthDay}/${item.birthYear}`,
      street: item.street,
      city: item.city,
      state: item.state,
    }))
  }, [application])

  const accessibilityLabels = (accessibility) => {
    const labels = []
    if (accessibility.mobility) labels.push(t("application.ada.mobility"))
    if (accessibility.vision) labels.push(t("application.ada.vision"))
    if (accessibility.hearing) labels.push(t("application.ada.hearing"))
    if (labels.length === 0) labels.push(t("t.no"))

    return labels
  }

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitle")}</title>
      </Head>
      {/* <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} /> */}
      <PageHeader>Applications Received</PageHeader>

      {console.log(applicationLoading && "loading...")}
      {console.log(applicationError)}
      {console.log(applicationDto)}

      <section className="flex flex-row w-full mx-auto max-w-screen-xl justify-between px-5 items-center my-3">
        <InlineButton arrow onClick={() => router.back()}>
          {t("t.back")}
        </InlineButton>

        {/* TODO:hardcoded until we get information from the backend */}
        <div className="status-bar__status md:pl-4 md:w-3/12">
          <Tag success pillStyle>
            Submitted
          </Tag>
        </div>
      </section>

      {applicationDto && (
        <section className="bg-primary-lighter">
          <div className="flex flex-row flex-wrap mx-auto px-5 mt-5 max-w-screen-xl">
            <div className="info-card md:w-9/12">
              <GridSection
                className="bg-primary-lighter"
                title={t("application.details.applicationData")}
                inset
              >
                <GridCell>
                  <ViewItem label={t("application.details.number")}>
                    {application.confirmationId}
                  </ViewItem>
                </GridCell>

                {/* TODO:hardcoded until we get information from the backend */}
                <GridCell>
                  <ViewItem label={t("application.details.type")}>Electronic</ViewItem>
                </GridCell>

                <GridCell>
                  <ViewItem label={t("application.details.submittedDate")}>
                    {applicationDate.date}
                  </ViewItem>
                </GridCell>

                <GridCell>
                  <ViewItem label={t("application.details.timeDate")}>
                    {applicationDate.time}
                  </ViewItem>
                </GridCell>

                {/* TODO:hardcoded until we get information from the backend */}
                <GridCell>
                  <ViewItem label={t("application.details.language")}>English</ViewItem>
                </GridCell>

                <GridCell>
                  <ViewItem label={t("application.details.totalSize")}>
                    {application.householdSize}
                  </ViewItem>
                </GridCell>

                <GridCell>
                  <ViewItem label={t("application.details.submittedBy")}>
                    {application.applicant.firstName} {application.applicant.middleName}{" "}
                    {application.applicant.lastName}
                  </ViewItem>
                </GridCell>
              </GridSection>

              {/* alternate contact */}
              {application.alternateContact.type !== "" &&
                application.alternateContact.type !== "noContact" && (
                  <GridSection
                    className="bg-primary-lighter"
                    title={t("application.alternateContact.type.label")}
                    inset
                  >
                    <GridCell>
                      <ViewItem label={t("application.name.firstName")}>
                        {application.alternateContact.firstName}
                      </ViewItem>
                    </GridCell>

                    <GridCell>
                      <ViewItem label={t("application.name.lastName")}>
                        {application.alternateContact.lastName}
                      </ViewItem>
                    </GridCell>

                    <GridCell>
                      <ViewItem label={t("t.relationship")}>
                        {t(
                          `application.alternateContact.type.options.${application.alternateContact.type}`
                        )}
                      </ViewItem>
                    </GridCell>

                    <GridCell>
                      <ViewItem label={t("application.details.agency")}>
                        {application.alternateContact.agency.length
                          ? application.alternateContact.agency
                          : t("t.none")}
                      </ViewItem>
                    </GridCell>

                    <GridCell>
                      <ViewItem label={t("t.email")}>
                        {application.alternateContact.emailAddress}
                      </ViewItem>
                    </GridCell>

                    <GridCell>
                      <ViewItem label={t("t.phone")}>
                        {application.alternateContact.phoneNumber}
                      </ViewItem>
                    </GridCell>
                  </GridSection>
                )}

              {/* household members */}
              {application.householdSize > 1 && (
                <GridSection
                  className="bg-primary-lighter"
                  title={t("application.household.householdMembers")}
                  grid={false}
                  tinted
                  inset
                >
                  <MinimalTable headers={householdMembersHeaders} data={householdMembersData} />
                </GridSection>
              )}

              {/* household details */}
              <GridSection
                className="bg-primary-lighter"
                title={t("application.review.householdDetails")}
                inset
              >
                <GridCell>
                  <ViewItem label={t("application.details.adaPriorities")}>
                    {accessibilityLabels(application.accessibility).map((item) => (
                      <Fragment key={item}>
                        {item}
                        <br />
                      </Fragment>
                    ))}
                  </ViewItem>
                </GridCell>
              </GridSection>

              {/* TODO: check live/work place */}
              <GridSection
                className="bg-primary-lighter"
                title={t("application.details.preferences")}
                inset
              >
                <GridCell>
                  <ViewItem label={t("application.details.workInAlameda")}></ViewItem>
                </GridCell>
              </GridSection>

              <GridSection
                className="bg-primary-lighter"
                title={t("application.details.householdIncome")}
                inset
              >
                <GridCell>
                  <ViewItem label={t("application.details.annualIncome")}>{annualIncome}</ViewItem>
                </GridCell>
                <GridCell>
                  <ViewItem label={t("application.details.vouchers")}>
                    {application.incomeVouchers ? t("t.yes") : t("t.no")}
                  </ViewItem>
                </GridCell>
              </GridSection>
            </div>

            <div className="md:w-3/12">
              <ul className="status-messages">
                <li className="status-message">
                  <div className="status-message__note text-center">
                    {t("t.lastUpdated")} {applicationUpdated}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}
    </Layout>
  )
}
