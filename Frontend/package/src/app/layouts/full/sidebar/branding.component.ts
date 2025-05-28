import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-branding',
  imports: [],
  template: `
    <a
      href="/dashboard"
      class="logodark"
      style="align-items: center"
      style="width: 100px; height: 70px"
    >
      <img
        src="./assets/images/logos/logo.jpg"
        style="width: 100px; height: 70px"
        alt="logo"
      />
    </a>
  `,
})
export class BrandingComponent {
  options = this.settings.getOptions();
  constructor(private settings: CoreService) {}
}
