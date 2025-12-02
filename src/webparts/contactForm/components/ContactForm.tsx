import * as React from 'react';
import type { IContactFormProps } from './IContactFormProps';
import MainForm from './MainForm';
import "../../../ExternalRef/Css/Styles.css";


export default class ContactForm extends React.Component<IContactFormProps, {}> {
  public render(): React.ReactElement<IContactFormProps> {


    return (
      <MainForm context={this.props.context}
        apiurl={this.props.apiurl}

      />
    );
  }
}
