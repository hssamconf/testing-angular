import {DebugElement} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';

import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule} from "@angular/forms";
import {AppMaterialModule} from "../../app.material.module";

import {ContactEditComponent} from "./contact-edit.component";

import {
  Contact,
  ContactService,
  FavoriteIconDirective,
  InvalidEmailModalComponent,
  InvalidPhoneNumberModalComponent
} from "../shared";

describe("init component test", () => {
  let fixture: ComponentFixture<ContactEditComponent>; // ComponentFixture contains methods that help you debug and test a component
  let component: ContactEditComponent;
  let rootElement: DebugElement; // DebugElement for our component, which is how you’ll access its children

  const contactServiceStub = { // A stub is a simple fake with no logic
    contact: {
      id: 1,
      name: 'houssam'
    },
    save: async function (contact: Contact) {
      component.contact = contact;
    },
    getContact: async function () {
      component.contact = this.contact;
      return this.contact;
    },
    updateContact: async function (contact: Contact) {
      component.contact = contact;
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContactEditComponent, FavoriteIconDirective, InvalidEmailModalComponent, InvalidPhoneNumberModalComponent],
      imports: [
        AppMaterialModule,
        FormsModule,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      providers: [{provide: ContactService, useValue: contactServiceStub}]
    });

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [InvalidEmailModalComponent, InvalidPhoneNumberModalComponent]
      }
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    rootElement = fixture.debugElement;
  });

})
