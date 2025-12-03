/* eslint-disable @typescript-eslint/no-floating-promises*/
/* eslint-disable  @typescript-eslint/no-use-before-define*/

import * as React from "react";
import styles from "./ContactForm.module.scss";
import { Checkbox, Input, Select, Button, message } from "antd";
import { UserOutlined, MailOutlined, InboxOutlined } from "@ant-design/icons";
import greenBackground from "../../../ExternalRef/Images/Contact.jpg";
import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { Web } from "@pnp/sp/webs";

import "@pnp/sp/lists";
import "@pnp/sp/items";
import SuccessScreen from "./SuccessScreen/SuccessScreen";
import Loader from "./Loader/Loader";
import SpServices from "../../../ExternalRef/SpServices";
import { sp } from "@pnp/sp/presets/all";

interface MobileInfo {
  country: string;
  countryCode: string;
  dialCode: string;
  value: string;
}

// Dropdown option structure
export interface ProjectTypeOption {
  label: string;
  value: string;
}

// Entire form data structure
export interface LeadFormData {
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: MobileInfo[];
  source: string;
  status: string;
  leadDate: string;
  serviceChoice: string[];
  projectType: string;
  rfi: boolean;
  createdBy: string;
}
const MainForm = ({ context, apiurl }: any) => {
  const serverRelativeUrl = context?.pageContext?.web?.serverRelativeUrl || "";
  const siteurl = context?.pageContext?.web?.absoluteUrl || "";
  const config = {
    listNamesConfig: {
      leadDocuments: "LeadDocuments",
    },
  };
  const currentUserName = context?._pageContext?._user?.displayName ?? "";

  const today = new Date().toISOString().split("T")[0];

  const [isAccepted, setIsAccepted] = useState<boolean>(false);
  const [issubmitted, setIsSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [projectTypeOptions, setProjectTypeOptions] = useState<
    ProjectTypeOption[]
  >([]);
  const [contacts, setContacts] = useState<any[]>([]);

  const [formData, setFormData] = useState<LeadFormData>({
    companyName: "",
    firstName: "",
    lastName: "",
    email: "",
    mobile: [] as MobileInfo[],
    source: "Referrals",
    status: "Lead captured",
    leadDate: today,
    serviceChoice: [] as string[],
    projectType: "",
    rfi: true,
    createdBy: currentUserName || "",
  });

  const getProjectTypeOptions = async (): Promise<ProjectTypeOption[]> => {
    try {
      // const otherWeb = Web("https://chandrudemo.sharepoint.com/sites/ANPCPMC_BusinessDevelopment");
      const otherWeb = Web(siteurl);
      const items = await otherWeb.lists
        .getByTitle("FieldsConfig")
        .items.filter("FieldName eq 'ProjectType'")
        .select("FieldValue")
        .get();
      const options = items?.map((item: any) => ({
        label: item?.FieldValue,
        value: item?.FieldValue,
      }));
      setProjectTypeOptions(options);
      await getAllContacts();
      return options;
    } catch (error) {
      message.error("Error fetching ProjectType options:", error);
      return [];
    }
  };

  const getAllContacts = async (): Promise<void> => {
    try {
      const contacts = await fetch(`${apiurl}/Contact/List?skip=0&take=5000`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const contactsData = await contacts.json();
      setContacts(contactsData?.data || []);
      console.log("contactsData: ", contactsData);
    } catch (error) {
      console.log("Error fetching contacts:", error);
    }
  };

  const handleServiceChange = (checkedValues: any) => {
    setFormData((prev: any) => ({ ...prev, serviceChoice: checkedValues }));
  };

  //handle input change
  const handleInputChange = (key: string, value: string | any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  //Create folder
  const createLeadFolder = async (leadID: number, leadStatus: string) => {
    const libraryPath = `${serverRelativeUrl}/${config.listNamesConfig.leadDocuments}`;
    const mainFolderPath = `${libraryPath}/${formData?.companyName
      ?.replace(/ /g, "")
      .toUpperCase()}-${leadID}`;
    const subFoldersNames = ["Sections", "RFP", "PQ", "Documents"];
    try {
      const res = await SpServices.SPCreateLibraryFolder({
        folderPath: mainFolderPath,
      });
      await res?.folder.listItemAllFields.get().then(async (item: any) => {
        await sp.web.lists
          .getByTitle(config?.listNamesConfig?.leadDocuments)
          .items.getById(item.Id)
          .update({
            LeadID: leadID,
          });
      });
      try {
        subFoldersNames?.forEach(async (e: string) => {
          await SpServices.SPCreateLibraryFolder({
            folderPath: `${res?.data?.ServerRelativeUrl}/${e}`,
          });
        });
      } catch (err) {
        console.log("CreateSubLeadFolder err", err);
      }
    } catch (err) {
      console.log("CreateLeadFolder err", err);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (loading) return;

    if (formData?.serviceChoice?.length === 0) {
      message.warn({
        content: "Please select at least one service.",
        style: {
          position: "fixed",
          top: 50,
          right: 20,
          transform: "none",
        },
      });
      return;
    }
    if (!formData?.firstName?.trim()) {
      message.warn({
        content: "First name is required.",
        style: {
          position: "fixed",
          top: 50,
          right: 20,
          transform: "none",
        },
      });
      return;
    }

    // if (!formData.mobile.trim()) {

    const typedMobile =
      formData.mobile?.length && formData.mobile[0].value
        ? formData.mobile[0].value
            .replace(formData.mobile[0].dialCode, "")
            .trim()
        : "";

    if (!typedMobile) {
      message.warn({
        content: "Mobile number is required.",
        style: {
          position: "fixed",
          top: 50,
          right: 150,
          transform: "none",
        },
      });
      return;
    }

    if (!formData?.email) {
      message.warn({
        content: "Email is required.",
        style: {
          position: "fixed",
          top: 50,
          right: 20,
          transform: "none",
        },
      });
      return;
    }
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      message.warn({
        content: "Enter a valid email address.",
        style: {
          position: "fixed",
          top: 50,
          right: 20,
          transform: "none",
        },
      });
      return;
    }

    if (!formData.companyName?.trim()) {
      message.warn({
        content: "Company name is required.",
        style: {
          position: "fixed",
          top: 50,
          right: 20,
          transform: "none",
        },
      });
      return;
    }
    if (!formData.projectType?.trim()) {
      message.warn({
        content: "Project type is required.",
        style: {
          position: "fixed",
          top: 50,
          right: 20,
          transform: "none",
        },
      });
      return;
    }

    try {
      const endpoint = `${apiurl}/Lead/Add`;
      setLoading(true);
      // CHECK CONTACT EXISTS
      const existingContact = contacts.find(
        (c) => c.email?.toLowerCase() === formData.email?.toLowerCase()
      );

      let contactId = 0;

      if (existingContact) {
        // If contact exists
        contactId = existingContact.id;
      } else {
        // CREATE NEW CONTACT
        const contactPayload = {
          companyName: formData.companyName,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          mobile: formData?.mobile?.length
            ? JSON.stringify(formData?.mobile)
            : "",
          // mobile: safeStringify(formData?.mobile),
          source: formData.source,

          description: "",
          contactDate: new Date().toISOString(),
        };

        const contactRes = await fetch(`${apiurl}/Contact/Add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(contactPayload),
        });

        if (!contactRes.ok) throw new Error("Failed to create contact");

        const newContact = await contactRes.json();

        contactId = newContact;
      }

      // CREATE LEAD
      let leadPayload = {
        ...formData,

        serviceChoice: formData?.serviceChoice?.length
          ? JSON.stringify(formData.serviceChoice)
          : "",
        mobile: formData?.mobile?.length ? JSON.stringify(formData.mobile) : "",

        leadZohoId: "",
        contactId: contactId,
        rfiUrl: existingContact?.rfiUrl || null,
        contactZohoId: existingContact?.contactZohoId || null,
      };
      const leadResponse = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leadPayload),
      });

      if (!leadResponse.ok) {
        throw new Error(`HTTP error! status: ${leadResponse.status}`);
      }

      const leadData = await leadResponse.json();
      console.log("resData: ", leadData);

      // CREATE FOLDER
      if (leadData) {
        await createLeadFolder(leadData, "");
      }

      setTimeout(() => {
        setLoading(false);
        setIsSubmitted(true);
      }, 1000);
    } catch (error) {
      console.log("error: ", error);
      setLoading(false);
      message.error({
        content: "Error sending API request:",
        style: {
          position: "fixed",
          top: 50,
          right: 20,
          transform: "none",
        },
      });
    }
  };

  useEffect(() => {
    getProjectTypeOptions();
  }, []);

  return (
    <>
      {loading && <Loader />}
      {issubmitted && <SuccessScreen />}
      <div>
        <div
          className={styles.conBox}
          style={{
            backgroundImage: `url(${greenBackground})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          <div className={styles.con}>
            <div className={styles.formBox}>
              <div className={styles.form}>
                <div className={styles.formHeader}>
                  <h2 className={styles.formHeading}>Internal Referral Form</h2>
                </div>
                <div className={styles.formBody}>
                  <div className={styles.row}>
                    <label className={styles.rowLabel}>
                      Services <span>*</span>
                    </label>
                    <div className={styles.checkboxGroup}>
                      {/* <Checkbox>CPMC</Checkbox>
                                        <Checkbox>CCM</Checkbox> */}

                      <Checkbox.Group
                        className={styles.checkboxGroup}
                        options={["CPMC", "CCM"]}
                        value={formData.serviceChoice}
                        onChange={handleServiceChange}
                      />
                    </div>
                  </div>
                  <div className={styles.row}>
                    <label className={styles.rowLabel}>
                      Name <span>*</span>
                    </label>
                    <div className={styles.nameInputs}>
                      <div className={styles.inputWithLabel}>
                        <Input
                          placeholder="First name"
                          prefix={<UserOutlined style={{ color: "#d9d9d9" }} />}
                          value={formData.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                        />
                        {/* <label>First Name</label> */}
                      </div>
                      <div className={styles.inputWithLabel}>
                        <Input
                          placeholder="Last name"
                          value={formData.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                        />
                        {/* <label>Last Name</label> */}
                      </div>
                    </div>
                  </div>
                  <div className={styles.row}>
                    <label className={styles.rowLabel}>
                      Phone <span>*</span>
                    </label>
                    <div
                      className={`${styles.phoneNumberInput} phoneNumberInput`}
                    >
                      <PhoneInput
                        country={
                          formData.mobile.length
                            ? formData.mobile[0].countryCode
                            : "in"
                        }
                        value={formData.mobile[0]?.value || ""}
                        countryCodeEditable={false}
                        onChange={(value: any, data: any) => {
                          // reset if country changed or input cleared
                          const phoneObject = [
                            {
                              country: data?.name || "",
                              countryCode: data?.countryCode || "",
                              dialCode: data?.dialCode?.toString() || "",
                              // value: value || "",
                              value:
                                formData?.mobile[0]?.countryCode ===
                                data?.countryCode
                                  ? value
                                  : data?.dialCode?.toString() || "",
                            },
                          ];
                          handleInputChange("mobile", phoneObject);
                        }}
                        enableSearch={true}
                        // placeholder="Enter phone number"
                        inputStyle={{ width: "100%" }}
                      />
                    </div>
                  </div>

                  <div className={styles.row}>
                    <label className={styles.rowLabel}>
                      Email <span>*</span>
                    </label>
                    <Input
                      //  placeholder="Enter email"
                      prefix={
                        <MailOutlined
                          style={{ color: "#d9d9d9", fontSize: "16px" }}
                        />
                      }
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                    />
                  </div>
                  <div className={styles.row}>
                    <label className={styles.rowLabel}>
                      Company Name <span>*</span>
                    </label>
                    <Input
                      // placeholder="Enter company name"
                      prefix={
                        <InboxOutlined
                          style={{ color: "#d9d9d9", fontSize: "20px" }}
                        />
                      }
                      value={formData.companyName}
                      onChange={(e) =>
                        handleInputChange("companyName", e.target.value)
                      }
                    />
                  </div>
                  <div className={`${styles.row} dropDownFullField`}>
                    <label className={styles.rowLabel}>
                      Project Type <span>*</span>
                    </label>
                    <Select
                      options={projectTypeOptions}
                      value={formData.projectType}
                      onChange={(val) => handleInputChange("projectType", val)}
                    />
                  </div>
                  <div className={styles.row}>
                    <Checkbox
                      onChange={(e) => {
                        setIsAccepted(e.target.checked);
                      }}
                    >
                      I accept the Terms and Conditions.
                    </Checkbox>
                  </div>
                </div>
                <div className={styles.formFooter}>
                  <Button onClick={handleSubmit} disabled={!isAccepted}>
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default MainForm;
