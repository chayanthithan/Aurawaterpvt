import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from 'src/app/services/contact.service';
import { ToastService } from 'src/app/shared/toast/toast.service';
interface Bubble {
  id: number;
  size: number;
  left: number;
  duration: number;
  delay: number;
}
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
 @Input() title: string = 'Contact Us';
  @Input() subtitle: string = '';
  @Input() breadcrumbs: { label: string; link?: string }[] = [];

  bubbles: Bubble[] = [];
  ripples = [0, 1, 2];
  contactInfo = [
    {
      icon: 'fas fa-envelope',
      title: 'Email',
      value: 'aurawaterpvt@gmail. com',
      link: 'mailto:aurawaterpvt@gmail.com'
    },
    {
      icon: 'fas fa-phone',
      title: 'Phone',
      value: '0707060028',
      link: 'tel:+94707060028'
    },
    {
      icon: 'fas fa-map-marker-alt',
      title: 'Address',
      value: 'No 419, Sawmill Road, Thirunagar south, Kilinochchi, Nothern Province, Sri Lanka',
      link: 'https://maps.google.com'
    }
  ];

  socialLinks = [
    { icon: 'fab fa-linkedin', url: 'https://www.linkedin.com/company/finspiresoftwaresolution' },
    // { icon: 'fab fa-twitter', url: 'https://twitter.com/finspire' },
    { icon: 'fab fa-instagram', url: 'https://www.instagram.com/fins_pire?igsh=Y3p0eHR2MDAzNjlj' },
    { icon: 'fab fa-facebook', url: 'https://www.facebook.com/share/1LaM55SZjo/' }
  ];

  constructor( private fb: FormBuilder, private toast: ToastService,private __contact: ContactService) { }

  contactForm!: FormGroup;
  ngOnInit(): void {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNo: ['', Validators.required],
      company: ['', Validators.required],
      interestedService: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
    this.generateBubbles();
  }

  generateBubbles(): void {
    this.bubbles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 40 + 15,
      left: Math.random() * 100,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 4
    }));
  }
  onSubmit(form: FormGroup) {
    debugger
      console.log('Form submitted:', form.value);
      if (form.valid) {
        this.__contact.addContact(form.value).subscribe({
          next: (res) => {
            console.log("Contact added successfully",res); 
            this.toast.success(res);
            form.reset();
          },
          error: (err) => {
            console.log("Contact added failed",err); 
            this.toast.error(err.error);
          }
        })
      }
  }

}
