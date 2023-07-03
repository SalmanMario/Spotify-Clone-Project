import {ExplicitContent, ExternalUrls, Followers, Image} from './common';

export type UserProfile = {
  country: string;
  display_name: string;
  email: string;
  explicit_content: ExplicitContent;
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: Array<Image>;
  product: string;
  type: string;
  uri: string;
};
