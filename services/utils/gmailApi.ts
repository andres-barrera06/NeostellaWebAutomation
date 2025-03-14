import axios, { AxiosRequestConfig } from "axios";
import { Page } from 'playwright';
import qs from "qs";

class GmailAPI {
  accessToken: string;
  private page: Page;

  constructor() {
    this.accessToken = "";
    this.getAccessToken();
  }

  getAccessToken = async (): Promise<void> => {
    const data = qs.stringify({
      client_id:
          "605407007932-1asbhj50kjui53l4l3cl6c5f6m95stst.apps.googleusercontent.com",
      client_secret: "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",
      refresh_token:
          "1//0dudue0eogTPrCgYIARAAGA0SNwF-L9IrgG-lnyH66LRIs4w2hy2UTe0iX-w1nwgcp6l8W6W13GyIsa2DJ5fU63qd4pxvcEdAfmk",
      grant_type: "refresh_token",
    });
    const config: AxiosRequestConfig = {
      method: "post",
      url: "https://accounts.google.com/o/oauth2/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };
    try {
      const response = await axios(config);
      this.accessToken = response.data.access_token;
    } catch (error) {
      console.log("❌ error access token");
    }
  };

  searchGmail = async (searchItem: string, additionalArgument: any): Promise<string> => {
    const config: AxiosRequestConfig = {
      method: "get",
      url: `https://www.googleapis.com/gmail/v1/users/me/messages?q=${searchItem}`,
      headers: {
        Authorization: `Bearer ${this.accessToken} `,
      },
    };
    try {
      const response = await axios(config);

      return response.data["messages"][0].id;
    } catch (error) {
      console.log("❌ Error search item in gmail");
      return "";
    }
  };

  readGmailContent = async (messageId: string, additionalArgument: any): Promise<object> => {
    const config: AxiosRequestConfig = {
      method: "get",
      url: `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    };
    try {
      const response = await axios(config);

      return response.data;
    } catch (error) {
      console.log("❌ Error get Message in gmail");
      return {};
    }
  };

  readInboxContent = async (searchText: string): Promise<string> => {
    let retries = 10;
    while (retries > 0) {
      try {
        const threadId = await this.searchGmail(searchText, { timeout: 30000 });
        const message = await this.readGmailContent(threadId, { timeout: 30000 });
        const encodedMessage = message["payload"]["body"]["data"];
        const decodedStr = Buffer.from(encodedMessage, "base64").toString("ascii");
        console.error("✅ OTP code was found");
        return decodedStr;
      } catch (error) {
        console.error("❌ Fail trying get the OTP code");
        retries--;
      }
    }
    throw new Error("FAIL");
  };
}

export default new GmailAPI();

