export default function AccountModel(id, username, emailAddress, facebookId, image, fullName) {
    this.id = id;
    this.username = username;
    this.emailAddress = emailAddress;
    this.facebookId = facebookId;
    this.image = image;
    this.fullName = fullName;

    return this;
}