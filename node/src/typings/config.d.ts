
type FeiTunaBasicCredentialPair = {
  username: string;
  password: string;
}

type FeiTunaConfig = {
  credentials: {
    [key in import("../enums/config").Services]: FeiTunaBasicCredentialPair
  },
  baseUrls: {
    [key in import("../enums/config").Services]: string;
  }
}