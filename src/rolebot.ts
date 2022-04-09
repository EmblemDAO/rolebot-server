import { CLIENT_OPTIONS, VERIFY_URL, CMD_PREFIX } from "./config";
import { Commands, Palette } from "./config";
import Discord, { 
  Client, 
  ColorResolvable, 
  Message, 
  MessageEmbed, 
  User 
} from "discord.js";
import Messages from "./messages.json";

export default class Rolebot {

  client: Client;

  constructor( token: string ) {
    this.client = new Discord.Client(CLIENT_OPTIONS);
    this.registerEventHandlers();
    this.client.login(token);
  }

  // SETUP /////////////////////////////////////////////////////////////////////
  // FN:REGISTER_EVENT_HANDLERS ////////////////////////////////////////////////
  registerEventHandlers() {
    this.client.on('ready', this.onReady.bind(this));
    this.client.on("messageCreate", this.onMessageCreate.bind(this));
  }
  //////////////////////////////////////////////////////////////////////////////

  // EVENTS ////////////////////////////////////////////////////////////////////
  // ON:READY //////////////////////////////////////////////////////////////////
  onReady() {
    console.log("// 🤖 Rolebot operational //");
  }
  // ON:MESSAGE_CREATE /////////////////////////////////////////////////////////
  async onMessageCreate( message: Message ) {
    if (message.author.bot || message.inGuild() ) return; // DMs only //////////
    if (!message.content.startsWith(CMD_PREFIX)) return; // Commands only //////
    const CMD = message.content.slice(1);
    switch (CMD) {
      case Commands.ShowUserRoles:
        this.sendVerificationLink(message.author);
        break;
      case Commands.UnlinkWallet:
        // TODO Implement function to wipe a user's data (on this server?) /////
        break;
      case Commands.ShowServerConfig:
        // TODO Only show this information to Rolebot server admins ////////////
        // MAYBEDO Respond with a "Select Server" dropdown /////////////////////
        this.sendServerConfig(message.author);
        break;
      case Commands.MockWelcome:
        this.sendMockWelcomeMessage(message.author);
        break;
      default:
        console.log("// 🤖 Unknown command encountered //");
    }
  }
  //////////////////////////////////////////////////////////////////////////////

  // FUNC //////////////////////////////////////////////////////////////////////
  // FN:SEND_PRIVATE_MESSAGE ///////////////////////////////////////////////////
  sendPrivateMessage( to: User, title = "", desc = "", color?: Palette ) {
    const MSG = new MessageEmbed();
    MSG.setColor((color ? color : Palette.Brand) as ColorResolvable);
    if (title !== "") MSG.setTitle(title);
    if (desc !== "") MSG.setDescription(desc);
    to.send({ embeds: [MSG] });
  }
  // FN:SEND_VERIFICATION_LINK /////////////////////////////////////////////////
  sendVerificationLink( user: User ) {
    const URL = VERIFY_URL + '' // Any params? E.g. Server / user ID? //////////
    const DESC = Messages.unverified.description.replace(/\$URL/ig, URL);
    this.sendPrivateMessage(user, Messages.unverified.title, DESC);
  }
  // FN:SEND_SERVER_CONFIG ////////////////////////////////////////////////////
  sendServerConfig( user: User ) {
    this.sendPrivateMessage(
      user, 
      Messages.config.title, 
      Messages.config.description, 
      Palette.Confidential
    );
  }
  // FN:SEND_MOCK_WELCOME_MESSAGE //////////////////////////////////////////////
  sendMockWelcomeMessage( user: User ) {
    const T = Messages.welcome.title.replace('$PROTOCOL', 'The Graph');
    const D = Messages.welcome.description.replace(/\$PROTOCOL/ig, 'The Graph');
    this.sendPrivateMessage(user, T, D);
  }
  // FN:POST_WELCOME_MESSAGE ///////////////////////////////////////////////////
  postWelcomeMessage() {
    // TODO See if we can determine the guild's 'general' channel //////////////
    // TODO Post the message publicly in 'general' /////////////////////////////
  }
  //////////////////////////////////////////////////////////////////////////////

}