// ========================================
// TRANSLATION SERVICE - C-1
// Create: src/app/services/translation.service.ts
// ========================================

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Language = 'en' | 'de';

interface Translations {
  [key: string]: {
    en: string;
    de: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguage = new BehaviorSubject<Language>('en');
  public language$ = this.currentLanguage.asObservable();

  private translations: Translations = {
    // Header
    'header.logout': { en: 'Logout', de: 'Abmelden' },
    'header.welcome': { en: 'Welcome', de: 'Willkommen' },
    
    // Dashboard
    'dashboard.title': { en: 'Dashboard', de: 'Übersicht' },
    'dashboard.today': { en: 'Today', de: 'Heute' },
    'dashboard.tasks': { en: 'Tasks', de: 'Aufgaben' },
    'dashboard.todaysTasks': { en: "Today's Tasks", de: 'Heutige Aufgaben' },
    'dashboard.totalLearningTime': { en: 'Total learning time', de: 'Gesamte Lernzeit' },
    'dashboard.noTasks': { en: 'No tasks for today', de: 'Keine Aufgaben für heute' },
    'dashboard.learnSuccessfully': { en: 'Learn successfully!', de: 'Erfolgreich lernen!' },
    'dashboard.reminders': { en: 'Task Reminders', de: 'Aufgaben-Erinnerungen' },
    'dashboard.overdueTasks': { en: 'overdue task(s)', de: 'überfällige Aufgabe(n)' },
    'dashboard.upcomingTasks': { en: 'upcoming task(s) this week', de: 'anstehende Aufgabe(n) diese Woche' },
    
    // Tasks Page
    'tasks.title': { en: 'Learning Goals / Tasks', de: 'Lernziele / Aufgaben' },
    'tasks.addNew': { en: 'Add New Task', de: 'Neue Aufgabe hinzufügen' },
    'tasks.yourTasks': { en: 'Your Tasks', de: 'Deine Aufgaben' },
    'tasks.noTasksYet': { en: 'No tasks yet. Add your first learning goal!', de: 'Noch keine Aufgaben. Füge dein erstes Lernziel hinzu!' },
    'tasks.noResults': { en: 'No tasks match your filters. Try adjusting your search criteria.', de: 'Keine Aufgaben entsprechen deinen Filtern. Passe deine Suchkriterien an.' },
    'tasks.showing': { en: 'Showing', de: 'Zeige' },
    'tasks.of': { en: 'of', de: 'von' },
    
    // Task Form Fields
    'tasks.field.title': { en: 'Title', de: 'Titel' },
    'tasks.field.learningTime': { en: 'Learning Time (minutes)', de: 'Lernzeit (Minuten)' },
    'tasks.field.date': { en: 'Date', de: 'Datum' },
    'tasks.field.category': { en: 'Category (optional)', de: 'Kategorie (optional)' },
    'tasks.field.categoryPlaceholder': { en: 'e.g., Study, Work', de: 'z.B. Studium, Arbeit' },
    
    // Filters
    'filter.date': { en: 'Date', de: 'Datum' },
    'filter.category': { en: 'Category', de: 'Kategorie' },
    'filter.search': { en: 'Search', de: 'Suche' },
    'filter.searchPlaceholder': { en: 'Search by title...', de: 'Nach Titel suchen...' },
    'filter.clearAll': { en: 'Clear All', de: 'Alle löschen' },
    
    // Buttons
    'button.add': { en: 'Add Task', de: 'Aufgabe hinzufügen' },
    'button.edit': { en: 'Edit', de: 'Bearbeiten' },
    'button.save': { en: 'Save', de: 'Speichern' },
    'button.cancel': { en: 'Cancel', de: 'Abbrechen' },
    'button.delete': { en: 'Delete', de: 'Löschen' },
    'button.dashboard': { en: 'Dashboard', de: 'Übersicht' },
    
    // Table Headers
    'table.title': { en: 'Title', de: 'Titel' },
    'table.learningTime': { en: 'Learning Time (min)', de: 'Lernzeit (Min)' },
    'table.date': { en: 'Date', de: 'Datum' },
    'table.category': { en: 'Category', de: 'Kategorie' },
    'table.actions': { en: 'Actions', de: 'Aktionen' },
    
    // Time units
    'time.min': { en: 'min', de: 'Min' },
    
    // Confirmations
    'confirm.delete': { en: 'Are you sure you want to delete this task?', de: 'Möchtest du diese Aufgabe wirklich löschen?' },
    
    // Language Selector
    'language.english': { en: 'English', de: 'Englisch' },
    'language.german': { en: 'German', de: 'Deutsch' },
    
    // Settings Page
    'settings.title': { en: 'Account Settings', de: 'Kontoeinstellungen' },
    'settings.profile.title': { en: 'Profile', de: 'Profil' },
    'settings.profile.loading': { en: 'Loading account information...', de: 'Kontoinformationen werden geladen...' },
    'settings.profile.username': { en: 'Username', de: 'Benutzername' },
    'settings.profile.email': { en: 'Email', de: 'E-Mail' },
    'settings.profile.newPassword': { en: 'New Password', de: 'Neues Passwort' },
    'settings.profile.passwordPlaceholder': { en: 'Leave empty to keep current password', de: 'Leer lassen, um aktuelles Passwort zu behalten' },
    'settings.profile.saveChanges': { en: 'Save Changes', de: 'Änderungen speichern' },
    
    'settings.appearance.title': { en: 'Settings', de: 'Einstellungen' },
    'settings.appearance.theme': { en: 'Theme mode', de: 'Design-Modus' },
    'settings.appearance.themeDescription': { en: 'Switch between light and dark mode', de: 'Wechsel zwischen hellem und dunklem Modus' },
    'settings.appearance.lightMode': { en: 'Light Mode', de: 'Hell-Modus' },
    'settings.appearance.darkMode': { en: 'Dark Mode', de: 'Dunkel-Modus' },
    
    'settings.language.title': { en: 'Language', de: 'Sprache' },
    'settings.language.description': { en: 'Choose your preferred language', de: 'Wähle deine bevorzugte Sprache' },
    
    'settings.delete.title': { en: 'Delete Account', de: 'Konto löschen' },
    'settings.delete.warning': { en: 'Deleting your account is permanent and cannot be undone. All your data will be removed.', de: 'Das Löschen deines Kontos ist dauerhaft und kann nicht rückgängig gemacht werden. Alle deine Daten werden entfernt.' },
    'settings.delete.button': { en: 'Delete Account', de: 'Konto löschen' },
    
    'settings.error.fetchUser': { en: 'Failed to fetch user data. Please try again later.', de: 'Benutzerdaten konnten nicht geladen werden. Bitte versuche es später erneut.' },
    'settings.error.usernameInvalid': { en: 'Username must be 3-20 characters long and contain only letters and numbers.', de: 'Benutzername muss 3-20 Zeichen lang sein und nur Buchstaben und Zahlen enthalten.' },
    'settings.error.passwordInvalid': { en: 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.', de: 'Passwort muss mindestens 8 Zeichen lang sein und Groß-, Kleinbuchstaben, Zahl und Sonderzeichen enthalten.' },
    'settings.error.emailInvalid': { en: 'Please enter a valid email address.', de: 'Bitte gib eine gültige E-Mail-Adresse ein.' },
    'settings.error.updateFailed': { en: 'Failed to update account. Please try again.', de: 'Kontoaktualisierung fehlgeschlagen. Bitte versuche es erneut.' },
    
    'settings.success.accountUpdated': { en: 'Account updated successfully. You will now be logged out and need to log in again.', de: 'Konto erfolgreich aktualisiert. Du wirst jetzt abgemeldet und musst dich erneut anmelden.' },
    'settings.success.languageChanged': { en: 'Language changed successfully!', de: 'Sprache erfolgreich geändert!' },
    
    'settings.confirm.deleteAccount': { en: 'Are you absolutely sure?\nThis will permanently delete your account.', de: 'Bist du dir absolut sicher?\nDies wird dein Konto dauerhaft löschen.' },
    
    // Subjects/Cards
    'subjects.addNew': { en: 'Add new subject', de: 'Neues Fach hinzufügen' },
    'subjects.createNew': { en: 'Create a new subject', de: 'Erstelle ein neues Fach' },
    'subjects.placeholder': { en: 'Subject name', de: 'Fachname' },
    'subjects.openSubject': { en: 'Open subject', de: 'Fach öffnen' },
    'subjects.deleteTitle': { en: 'Delete subject', de: 'Fach löschen' },
    'subjects.noSubjects': { en: 'No subjects yet. Add your first one!', de: 'Noch keine Fächer. Füge dein erstes hinzu!' },
    'subjects.confirm.delete': { en: 'Are you sure you want to delete "{name}"?\n\nThis will also delete all files in this subject.', de: 'Möchtest du "{name}" wirklich löschen?\n\nDies wird auch alle Dateien in diesem Fach löschen.' },
    'subjects.error.deleteFailed': { en: 'Failed to delete subject. Please try again.', de: 'Fach konnte nicht gelöscht werden. Bitte versuche es erneut.' },
    
    // Files/Subject Page
    'files.title': { en: 'Subject Files', de: 'Fach-Dateien' },
    'files.uploadNew': { en: 'Upload New File', de: 'Neue Datei hochladen' },
    'files.allowed': { en: 'Allowed', de: 'Erlaubt' },
    'files.maxSize': { en: 'Max size', de: 'Max. Größe' },
    'files.uploadedFiles': { en: 'Uploaded Files', de: 'Hochgeladene Dateien' },
    'files.noFiles': { en: 'No files uploaded yet. Upload your first file above!', de: 'Noch keine Dateien hochgeladen. Lade deine erste Datei oben hoch!' },
    'files.button.upload': { en: 'Upload', de: 'Hochladen' },
    'files.button.download': { en: 'Download', de: 'Herunterladen' },
    'files.button.rename': { en: 'Rename', de: 'Umbenennen' },
    'files.error.typeNotSupported': { en: 'File type not supported', de: 'Dateityp nicht unterstützt' },
    'files.error.sizeExceeds': { en: 'File size exceeds 10MB limit', de: 'Dateigröße überschreitet 10MB-Limit' },
    'files.error.selectFile': { en: 'Please select a file first', de: 'Bitte wähle zuerst eine Datei' },
    'files.error.uploadFailed': { en: 'Failed to upload file', de: 'Datei-Upload fehlgeschlagen' },
    'files.error.downloadFailed': { en: 'Failed to download file', de: 'Datei-Download fehlgeschlagen' },
    'files.error.emptyFilename': { en: 'Filename cannot be empty', de: 'Dateiname darf nicht leer sein' },
    'files.success.uploaded': { en: 'uploaded successfully!', de: 'erfolgreich hochgeladen!' },
    'files.confirm.delete': { en: 'Are you sure you want to delete "{name}"?', de: 'Möchtest du "{name}" wirklich löschen?' },
    
    // Auth Pages
    'auth.welcome': { en: 'Welcome to Lernify', de: 'Willkommen bei Lernify' },
    'auth.subtitle': { en: 'Empower your learning journey', de: 'Stärke deine Lernreise' },
    'auth.login.title': { en: 'Login', de: 'Anmelden' },
    'auth.login.username': { en: 'Username', de: 'Benutzername' },
    'auth.login.password': { en: 'Password', de: 'Passwort' },
    'auth.login.button': { en: 'Login', de: 'Anmelden' },
    'auth.login.noAccount': { en: "Don't have an account?", de: 'Noch kein Konto?' },
    'auth.login.registerHere': { en: 'Register here', de: 'Hier registrieren' },
    'auth.login.error': { en: 'Invalid username or password', de: 'Ungültiger Benutzername oder Passwort' },
    
    'auth.register.title': { en: 'Register', de: 'Registrieren' },
    'auth.register.email': { en: 'Email', de: 'E-Mail' },
    'auth.register.button': { en: 'Register', de: 'Registrieren' },
    'auth.register.hasAccount': { en: 'Already have an account?', de: 'Schon ein Konto?' },
    'auth.register.loginHere': { en: 'Login here', de: 'Hier anmelden' },
    'auth.register.success': { en: 'Registration successful! Redirecting to login...', de: 'Registrierung erfolgreich! Weiterleitung zur Anmeldung...' },
    'auth.register.error.usernameExists': { en: 'Username or email already exists. Please choose another one.', de: 'Benutzername oder E-Mail existiert bereits. Bitte wähle einen anderen.' },
    'auth.register.error.failed': { en: 'Registration failed. Try again.', de: 'Registrierung fehlgeschlagen. Versuche es erneut.' },
  };

  constructor() {
    // Load saved language from localStorage
    const saved = localStorage.getItem('app-language') as Language;
    if (saved && (saved === 'en' || saved === 'de')) {
      this.currentLanguage.next(saved);
    }
  }

  get currentLang(): Language {
    return this.currentLanguage.value;
  }

  setLanguage(lang: Language): void {
    this.currentLanguage.next(lang);
    localStorage.setItem('app-language', lang);
  }

  translate(key: string): string {
    const translation = this.translations[key];
    if (!translation) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translation[this.currentLang];
  }

  // Shorthand method
  t(key: string): string {
    return this.translate(key);
  }
}