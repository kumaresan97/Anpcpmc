// // import * as React from "react";
// // import { Select, Input } from "antd";
// // import { useState } from "react";

// // const { Option } = Select;

// // interface Country {
// //     english_name: string;
// //     alpha2_code: string;
// //     phone_code: string;
// //     flagImage: string;
// // }

// // interface PhoneInputProps {
// //     countries: Country[];
// //     defaultCountryCode?: string;
// //     placeholder?: string;
// //     onChange?: (value: string, country: Country) => void;
// // }

// // export const PhoneInput: React.FC<PhoneInputProps> = ({
// //     countries,
// //     defaultCountryCode,
// //     placeholder = "Enter phone number",
// //     onChange,
// // }) => {
// //     const defaultCountry =
// //         countries.find((c: any) => c.alpha2_code === defaultCountryCode) || countries[0];

// //     const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
// //     const [phone, setPhone] = useState("");

// //     const handlePhoneChange = (value: string) => {
// //         setPhone(value);
// //         onChange?.(value, selectedCountry);
// //     };

// //     const handleCountryChange = (value: string) => {
// //         const country = countries.find(c => c.alpha2_code === value);
// //         if (country) {
// //             setSelectedCountry(country);
// //             onChange?.(phone, country);
// //         }
// //     };

// //     return (
// //         <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
// //             <Select
// //                 value={selectedCountry.alpha2_code}
// //                 onChange={handleCountryChange}
// //                 style={{ width: 200 }}
// //                 showSearch
// //                 optionLabelProp="label"
// //                 filterOption={(input: any, option: any) =>
// //                     (option?.label ?? "")
// //                         .toLowerCase()
// //                         .includes(input.toLowerCase())
// //                 }
// //             >
// //                 {countries.map((c: any) => (
// //                     <Option
// //                         key={c.alpha2_code}
// //                         value={c.alpha2_code}
// //                         label={`${c.english_name} (${c.phone_code})`}
// //                     >
// //                         <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
// //                             <img
// //                                 src={c.flagImage}
// //                                 alt={c.english_name}
// //                                 style={{ width: 20, height: 15, objectFit: "cover" }}
// //                             />
// //                             <span>{c.english_name} ({c.phone_code})</span>
// //                         </div>
// //                     </Option>
// //                 ))}
// //             </Select>

// //             <Input
// //                 style={{ width: 200 }}
// //                 placeholder={placeholder}
// //                 value={phone}
// //                 onChange={(e) => handlePhoneChange(e.target.value)}
// //                 addonBefore={selectedCountry.phone_code}
// //             />
// //         </div>
// //     );
// // };

// import * as React from "react";
// import { Input, Dropdown, Menu } from "antd";
// import { DownOutlined } from "@ant-design/icons";
// import { useState } from "react";

// interface Country {
//     english_name: string;
//     alpha2_code: string;
//     phone_code: string;
//     flagImage: string;
// }

// interface PhoneInputProps {
//     countries: Country[];
//     defaultCountryCode?: string;
//     placeholder?: string;
//     onChange?: (value: string, country: Country) => void;
// }

// export const PhoneInput: React.FC<PhoneInputProps> = ({
//     countries,
//     defaultCountryCode,
//     placeholder = "Enter phone number",
//     onChange,
// }) => {
//     const defaultCountry =
//         countries.find((c) => c.alpha2_code === defaultCountryCode) || countries[0];

//     const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
//     const [phone, setPhone] = useState("");
//     const [dropdownOpen, setDropdownOpen] = useState(false);

//     const handleCountrySelect = (country: Country) => {
//         setSelectedCountry(country);
//         setDropdownOpen(false);
//         onChange?.(phone, country);
//     };

//     const menu = (
//         <Menu>
//             {countries.map((c) => (
//                 <Menu.Item
//                     key={c.alpha2_code}
//                     onClick={() => handleCountrySelect(c)}
//                 >
//                     <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                         <img
//                             src={c.flagImage}
//                             alt={c.english_name}
//                             style={{ width: 20, height: 15, objectFit: "cover" }}
//                         />
//                         <span>{c.english_name} ({c.phone_code})</span>
//                     </div>
//                 </Menu.Item>
//             ))}
//         </Menu>
//     );

//     return (
//         <Input
//             style={{ width: 250 }}
//             placeholder={placeholder}
//             value={phone}
//             onChange={(e) => {
//                 setPhone(e.target.value);
//                 onChange?.(e.target.value, selectedCountry);
//             }}
//             addonBefore={
//                 <Dropdown
//                     overlay={menu}
//                     trigger={['click']}
//                     open={dropdownOpen}
//                     onOpenChange={(open) => setDropdownOpen(open)}
//                 >
//                     <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
//                         <img
//                             src={selectedCountry.flagImage}
//                             alt={selectedCountry.english_name}
//                             style={{ width: 20, height: 15, objectFit: "cover", marginRight: 4 }}
//                         />
//                         <span>{selectedCountry.phone_code}</span>
//                         <DownOutlined style={{ fontSize: 10, marginLeft: 4 }} />
//                     </div>
//                 </Dropdown>
//             }
//         />
//     );
// };

