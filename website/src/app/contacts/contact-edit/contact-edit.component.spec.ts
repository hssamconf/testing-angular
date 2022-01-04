import {DebugElement} from '@angular/core';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {By} from "@angular/platform-browser";

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

describe("ContactEditComponent tests", () => {
  let fixture: ComponentFixture<ContactEditComponent>; // ComponentFixture contains methods that help you debug and test a component
  let component: ContactEditComponent;
  let rootElement: DebugElement; // DebugElement for our component, which is how you’ll access its children

  const contactServiceStub = { // A stub is a simple fake with no logic
    contact: {
      id: 1,
      name: 'Houssam'
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

  beforeEach(() => { // sets up our TestBed configuration
    TestBed.configureTestingModule({
      declarations: [ContactEditComponent, FavoriteIconDirective, InvalidEmailModalComponent, InvalidPhoneNumberModalComponent],
      imports: [
        AppMaterialModule,
        FormsModule,
        NoopAnimationsModule, //to mock animations, which allows tests to run quickly without waiting for the animations to finish.
        RouterTestingModule
      ],
      providers: [{provide: ContactService, useValue: contactServiceStub}]
    });

    TestBed.overrideModule(BrowserDynamicTestingModule, { // overrideModule for lazy loading
      set: {
        entryComponents: [InvalidEmailModalComponent, InvalidPhoneNumberModalComponent]
      }
    });
  });

  beforeEach(() => { // set our instance variables
    fixture = TestBed.createComponent(ContactEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    rootElement = fixture.debugElement;
  });

  describe('saveContact() test', () => {
    //fakeAsync method to keep the test from finishing until the component has finished updating
    it('should display contact name after contact set', fakeAsync(() => {
      const contact = {
        id: 1,
        name: 'Houssam'
      };

      component.isLoading = false;
      component.saveContact(contact);
      fixture.detectChanges();
      const nameInput = rootElement.query(By.css('.contact-name'));
      tick(); // Tick to simulate the passage of time so the component will finish updating.
      expect(nameInput.nativeElement.value).toBe('Houssam');
    }));
  });

  describe('loadContact() test', () => {
    it('should load contact', fakeAsync(() => {
      component.isLoading = false;
      component.loadContact();
      fixture.detectChanges();
      const nameInput = rootElement.query(By.css('.contact-name'));
      tick();
      expect(nameInput.nativeElement.value).toBe('Houssam');
    }));
  });

  describe('updateContact() tests', () => {
    it('should update the contact', fakeAsync(() => {
      const newContact = {
        id: 1,
        name: 'delia',
        email: 'delia@example.com',
        number: '1234567890'
      };

      component.contact = {
        id: 2,
        name: 'rhonda',
        email: 'rhonda@example.com',
        number: '1234567890'
      };

      component.isLoading = false;
      fixture.detectChanges();
      const nameInput = rootElement.query(By.css('.contact-name'));
      tick();
      expect(nameInput.nativeElement.value).toBe('rhonda');

      component.updateContact(newContact);
      fixture.detectChanges();
      tick(100);
      expect(nameInput.nativeElement.value).toBe('delia');
    }));

    it('should not update the contact if email is invalid', fakeAsync(() => {
      const newContact = {
        id: 1,
        name: 'london',
        email: 'london@example',
        number: '1234567890'
      };

      component.contact = {
        id: 2,
        name: 'chauncey',
        email: 'chauncey@example.com',
        number: '1234567890'
      };
      component.isLoading = false;
      fixture.detectChanges();
      const nameInput = rootElement.query(By.css('.contact-name'));
      tick();
      expect(nameInput.nativeElement.value).toBe('chauncey');
      component.updateContact(newContact);
      fixture.detectChanges();
      tick(100);
      expect(nameInput.nativeElement.value).toBe('chauncey');
    }));

    it('should not update the contact if phone number is invalid', fakeAsync(() => {
      const newContact = {
        id: 1,
        name: 'london',
        email: 'london@example.com',
        number: '12345678901'
      };

      component.contact = {
        id: 2,
        name: 'chauncey',
        email: 'chauncey@example.com',
        number: '1234567890'
      };

      component.isLoading = false;
      fixture.detectChanges();
      const nameInput = rootElement.query(By.css('.contact-name'));
      tick();
      expect(nameInput.nativeElement.value).toBe('chauncey');

      component.updateContact(newContact);
      fixture.detectChanges();
      tick(100);
      expect(nameInput.nativeElement.value).toBe('chauncey');
    }));


  });

})
