import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class App {
  isDarkMode = false;

  constructor(private auth: AuthService) {
    // ✅ DO NOT clear token here
    // this.auth.clearLocalAuth(); // <- remove this

    // Load theme
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }
}
