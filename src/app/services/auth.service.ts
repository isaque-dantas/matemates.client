import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {LoginData, User, UserToSend} from "../interfaces/user";
import {Router} from "@angular/router";
import {UserService} from "./user.service";
import {baseApiUrl} from "../app.config";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userUrl = `${baseApiUrl}/users`
  private tokenUrl = `${baseApiUrl}/token`

  private readonly userDataKey = "userData"
  private readonly userImageKey = "profileImageBase64String"
  private readonly isUserStaffKey = "isLoggedUserStaff"
  private readonly userTokenKey = "access"

  loggedUserDataChanged = new EventEmitter<User>()
  loggedUserProfileImageChanged = new EventEmitter<string>()

  constructor(private http: HttpClient, private router: Router, private userService: UserService) {
  }

  login(credentials: LoginData): Observable<any> {
    console.log('Logging in with:', credentials);
    return this.http.post<{ access: string, refresh: string, userId: number }>(`${this.tokenUrl}`, credentials)
      .pipe(
        tap(response => {
            if (response.access) {
              localStorage.setItem(this.userTokenKey, response.access);

              this.router.navigate([''])
                .then(() => {
                  this.userService.getUserData(response.access).subscribe((data: User) => {
                    localStorage.setItem(this.isUserStaffKey, data["is_staff"].toString())
                    this.updateUserData(data)
                  })
                  this.userService.getProfileImage().subscribe((data: Blob) => {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const base64String = reader.result as string;
                        console.log("profile image em base64: ", base64String);
                        this.updateImage(base64String)
                      }

                      reader.readAsDataURL(data);
                    }
                  )
                })
            }
          }
        )
      )
  }

  getLoggedUser(): User | null {
    if (!this.isAuthenticated()) return null;
    return JSON.parse(localStorage.getItem(this.userDataKey)!)
  }

  updateUserData(data: User) {
    localStorage.setItem(this.userDataKey, JSON.stringify(data))
    this.loggedUserDataChanged.emit(data)
  }

  getLoggedUserProfileImage(): string | null {
    if (!this.isAuthenticated()) return null;
    return localStorage.getItem(this.userImageKey)!
  }

  updateImage(base64ImageString: string) {
    localStorage.setItem(this.userImageKey, base64ImageString)
    this.loggedUserProfileImageChanged.emit(base64ImageString)
  }

  isLoggedUserStaff(): boolean {
    if (!this.isAuthenticated()) {
      localStorage.setItem(this.isUserStaffKey, "false")
      return false
    }

    return localStorage.getItem(this.isUserStaffKey) == "true"
  }

  register(user: UserToSend): Observable<any> {
    console.log('Registering with:', user);
    return this.http.post(`${this.userUrl}`, user);
  }

  logout() {
    console.log("! ! ! ! ! ! ! !!!LOGOUT!!! ! ! ! ! ! ! !")
    localStorage.setItem(this.isUserStaffKey, "false")

    localStorage.removeItem(this.userTokenKey)
    localStorage.removeItem(this.userDataKey)
    localStorage.removeItem(this.userTokenKey)

    this.router.navigate(['login']);
    this.loggedUserDataChanged.emit()
  }

  isAuthenticated(): boolean {
    return this.doesAccessTokenExist() && this.isAccessTokenExpired()
  }

  isAccessTokenExpired(): boolean {
    if (!this.doesAccessTokenExist()) return false

    const token: string = localStorage.getItem(this.userTokenKey)!
    const encodedTokenPayload = token.split('.')[1]
    const decodedTokenPayload = JSON.parse(atob(encodedTokenPayload))
    const exp = decodedTokenPayload.exp

    if (!exp) return false

    const expirationDate = new Date(exp * 1000).getTime()
    const currentDate = new Date().getTime()

    return currentDate < expirationDate
  }

  doesAccessTokenExist() {
    return !!localStorage.getItem(this.userTokenKey);
  }

  getToken(): string | null {
    if (!this.isAuthenticated()) {
      return null
    }

    return "Bearer " + localStorage.getItem(this.userTokenKey);
  }
}
