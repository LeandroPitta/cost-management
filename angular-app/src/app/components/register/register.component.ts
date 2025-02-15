import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavigationService } from '../../core/navigation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { UserData } from '../../models/user-data';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [LoginComponent],
})
export class RegisterComponent implements OnInit {
  @ViewChild('backgroundColorSwiper') backgroundColorSwiper!: ElementRef;
  @ViewChild('titleColorSwiper') titleColorSwiper!: ElementRef;
  @ViewChild('fontFamilySwiper') fontFamilySwiper!: ElementRef;
  @ViewChild('backgroundGifSwiper') backgroundGifSwiper!: ElementRef;
  @ViewChild('budgetGifSwiper') budgetGifSwiper?: ElementRef;

  username: string = '';
  password: string = '';
  title: string = '';
  budgetValue: number = 0;
  backgroundColorId: number = 0;
  titleColorId: number = 0;
  fontFamilyId: number = 0;
  backgroundGifId: number = 0;
  budgetGifId: string = '';
  errorMessage: string = '';
  budgetGifOption: string = 'gif';
  budgetGifText: string = '';
  titleColors: any[] = [];
  backgroundColors: any[] = [];
  fontFamilies: any[] = [];
  backgroundGifs: any[] = [];
  budgetGifs: any[] = [];

  constructor(
    private userService: UserService,
    private navigationService: NavigationService,
    private snackBar: MatSnackBar,
    private loginComponent: LoginComponent
  ) {}

  ngOnInit(): void {
    this.loadCustomizationOptions();
  }

  loadCustomizationOptions(): void {
    this.userService.getTitleColors().subscribe((data) => {
      this.titleColors = data.titleColors;
    });

    this.userService.getBackgroundColor().subscribe((data) => {
      this.backgroundColors = data.backgroundColors;
    });

    this.userService.getFontFamilies().subscribe((data) => {
      this.fontFamilies = data.fontFamilies;
    });

    this.userService.getBackgroundGifs().subscribe((data) => {
      this.backgroundGifs = data.backgroundGifs;
    });

    this.userService.getBudgetGifs().subscribe((data) => {
      this.budgetGifs = data.budgetGifs;
    });
  }

  extractFontName(fontDescription: string): string {
    return fontDescription.split(',')[0].replace(/['"]/g, '');
  }

  register(): void {
    const backgroundColorSwiper =
      this.backgroundColorSwiper.nativeElement.swiper;
    const titleColorSwiper = this.titleColorSwiper.nativeElement.swiper;
    const fontFamilySwiper = this.fontFamilySwiper.nativeElement.swiper;
    const backgroundGifSwiper = this.backgroundGifSwiper.nativeElement.swiper;
    const budgetGifSwiper = this.budgetGifSwiper?.nativeElement?.swiper;

    this.backgroundColorId =
      this.backgroundColors[backgroundColorSwiper.activeIndex].id;
    this.titleColorId = this.titleColors[titleColorSwiper.activeIndex].id;
    this.fontFamilyId = this.fontFamilies[fontFamilySwiper.activeIndex].id;
    this.backgroundGifId =
      this.backgroundGifs[backgroundGifSwiper.activeIndex].id;
    if (this.budgetGifOption === 'text') {
      this.budgetGifId = this.budgetGifText;
    } else {
      this.budgetGifId =
        this.budgetGifs[budgetGifSwiper.activeIndex].id.toString();
    }

    const userData: UserData = {
      username: this.username,
      password: this.password,
      title: this.title,
      budgetValue: this.budgetValue,
      backgroundColorId: this.backgroundColorId,
      titleColorId: this.titleColorId,
      fontFamilyId: this.fontFamilyId,
      backgroundGifId: this.backgroundGifId,
      budgetGif: this.budgetGifId,
    };

    this.userService.register(userData).subscribe(
      (response) => {
        this.loginComponent.username = this.username;
        this.loginComponent.password = this.password;
        this.loginComponent.login();
        this.snackBar.open('User successfully registered', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
        });
      },
      (error) => {
        this.errorMessage = 'An error occurred. Please try again.';
      }
    );
  }

  cancel(): void {
    this.navigationService.navigateTo('login');
  }
}
