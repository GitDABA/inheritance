declare module 'netlify-identity-widget' {
  interface User {
    id: string;
    email: string;
    user_metadata: {
      full_name?: string;
      [key: string]: any;
    };
    app_metadata: {
      roles?: string[];
      [key: string]: any;
    };
    token: {
      access_token: string;
      token_type: string;
      expires_in: number;
      refresh_token: string;
      expires_at: number;
    };
  }

  interface Settings {
    autoshow?: boolean;
    container?: string;
    locale?: string;
  }

  interface Widget {
    init(settings?: Settings): void;
    open(callback?: Function): void;
    close(): void;
    logout(callback?: Function): void;
    refresh(force?: boolean): void;
    on(event: string, callback: Function): void;
    off(event: string, callback: Function): void;
    currentUser(): User | null;
    gotrue: any;
  }

  const widget: Widget;
  export default widget;
}
