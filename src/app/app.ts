import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class App {
  isDarkMode = false;

  constructor() {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';

    // Apply theme globally
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }
}
