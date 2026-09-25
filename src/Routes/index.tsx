import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import BottomTabBar from "../Components/BottomTabBar";
import CameraSideDrawer from "../Components/SideDrawer/CameraSideDrawer";
import SideDrawerMenu from "../Components/SideDrawer/SideDrawer";
import BlockedList from "../Screens/BlockedList";
import BookProfessional from "../Screens/BookProfessional";
import BuyTicket from "../Screens/BuyTicket";
import ChatBackground from "../Screens/ChatBackground";
import ChatSection from "../Screens/ChatSection";
import CommentScreen from "../Screens/CommentScreen";
import ConfirmOrder from "../Screens/ConfirmOrder";
import ConfirmTicketOrder from "../Screens/ConfirmTicketOrder";
import ContactList from "../Screens/ContactList";
import CreateEvent from "../Screens/CreateEvent";
import CreateGroup from "../Screens/CreateGroup";
import CreateNewCommunity from "../Screens/CreateNewCommunity";
import CreatePost from "../Screens/CreatePost";
import CreateProfessionalProfile from "../Screens/CreateProfessionalProfile";
import CreateStory from "../Screens/CreateStory";
import Dating from "../Screens/Dating";
import EditMyEvent from "../Screens/EditMyEvent";
import EditProfessionalProfile from "../Screens/EditProfessionalProfile";
import EditProfile from "../Screens/EditProfile";
import EventBuyTicket from "../Screens/EventBuyTicket";
import EventDetails from "../Screens/EventDetails";
import EventEditTicket from "../Screens/EventEditTicket";
import EventOrderSummary from "../Screens/EventOrderSummary";
import Events from "../Screens/Events";
import EventTicketDetail from "../Screens/EventTicketDetail";
import EventTicketSaleWithdrawl from "../Screens/EventTicketSaleWithdrawl";
import GroupMessagesPermissions from "../Screens/GroupMessagesPermissions";
import GroupMessagesPrivacy from "../Screens/GroupMessagesPrivacy";
import Home from "../Screens/Home";
import Maps from "../Screens/Maps";
import MatchList from "../Screens/MatchList";
import MatchScreen from "../Screens/MatchScreen";
import Messages from "../Screens/Messages";
import MyEventTicket from "../Screens/MyEventTickets";
import MyGroups from "../Screens/MyGroups";
import Notifications from "../Screens/Notifications";
import OnBoarding from "../Screens/OnBoarding";
import PaymentDone from "../Screens/PaymentDone";
import PostDetail from "../Screens/PostDetail";
import PremiumSubscriptions from "../Screens/PremiumSubscriptions";
import PreviewBackground from "../Screens/PreviewBackground";
import Professional from "../Screens/Professional";
import ProfessionalAccountDetails from "../Screens/ProfessionalAccountDetails";
import Analytics from "../Screens/ProfessionalAccountDetails/Analytics";
import Bookings from "../Screens/ProfessionalAccountDetails/Bookings";
import FeedBack from "../Screens/ProfessionalAccountDetails/FeedBack";
import MyEvents from "../Screens/ProfessionalAccountDetails/MyEvents";
import PreviewEvent from "../Screens/ProfessionalAccountDetails/PreviewEvent";
import PromoteYourself from "../Screens/ProfessionalAccountDetails/PromoteYourself";
import PromotionAnalytics from "../Screens/ProfessionalAccountDetails/PromotionAnalytics";
import PromotionBanner from "../Screens/ProfessionalAccountDetails/PromotionBanner";
import Promotions from "../Screens/ProfessionalAccountDetails/Promotions";
import ProfessionalProfileReview from "../Screens/ProfessionalProfileReview";
import ProfessionRole from "../Screens/ProfessionRole";
import Profile from "../Screens/Profile";
import PurchaseLikes from "../Screens/PurchaseLikes";
import Referral from "../Screens/Referral";
import RefferalWorking from "../Screens/RefferalWorking";
import Register from "../Screens/Register";
import ReportPost from "../Screens/ReportPost";
import Reports from "../Screens/Reports";
import ResellTicket from "../Screens/ResellTicket";
import SearchHome from "../Screens/SearchHome";
import SettingChangePassword from "../Screens/SettingChangePassword";
import SettingPasswordSecurity from "../Screens/SettingPasswordSecurity";
import SettingPrivacyPrefrences from "../Screens/SettingPrivacyPrefrences";
import SettingsAccount from "../Screens/SettingsAccount";
import SettingsAddPaymentMethod from "../Screens/SettingsAddPaymentMethod";
import SettingsBillingHistory from "../Screens/SettingsBillingHistory";
import SettingsChangeEmail from "../Screens/SettingsChangeEmail";
import SettingsChangePhoneNumber from "../Screens/SettingsChangePhoneNumber";
import SettingsForgotPassword from "../Screens/SettingsForgotPassword";
import SettingsHelpSupport from "../Screens/SettingsHelpSupport";
import SettingsNotification from "../Screens/SettingsNotification";
import SettingsPayment from "../Screens/SettingsPayment";
import SettingsPaymentMethod from "../Screens/SettingsPaymentMethod";
import SettingsProfileInfo from "../Screens/SettingsProfileInfo";
import SettingsRecieptDetail from "../Screens/SettingsRecieptDetail";
import SettingsScreen from "../Screens/SettingsScreen";
import SettingsSubscriptions from "../Screens/SettingsSubscriptions";
import { default as SettingsVerifyOtp } from "../Screens/SettingsVerifyEmailOTP";
import SettingsVerifyPassword from "../Screens/SettingsVerifyPassword";
import SettingsVerifyPhoneOtp from "../Screens/SettingsVerifyPhoneOtp";
import SideDrawerRefferal from "../Screens/SideDrawerRefferal";
import SignIn from "../Screens/SignIn";
import SingleEventAnalytics from "../Screens/SingleEventAnalytics";
import SingleEventDetail from "../Screens/SingleEventDetail";
import Splash from "../Screens/Splash";
import StartExploring from "../Screens/StartExploring";
import StoryData from "../Screens/StoryData";
import StoryScreen from "../Screens/StoryScreen";
import TicketDetails from "../Screens/TicketDetails";
import Tickets from "../Screens/Tickets";
import TicketScanner from "../Screens/TicketScanner";
import TicketTermsConditions from "../Screens/TicketTermsConditions";
import TransferTicket from "../Screens/TransferTicket";
import UserProfile from "../Screens/UserProfile";
import Welcome from "../Screens/Welcome";
import {
  AuthStackParams,
  BillinhHistoryStackParams,
  BottomTabParams,
  CameraDrawerParams,
  ChangeEmailStackParams,
  ChangePhoneNumberStackParams,
  MainStackParams,
  PaymentMethodStackParams,
  PostDetailStackParams,
  PremiumStackParams,
  ProfessionalStackParams,
  ReferralsStackParams,
  RootStackParams,
  SettingsAccountStackParams,
  SettingsPaymentStackParams,
  SettingsProfileInfoStackParams,
  SettingsStackParams,
  SideDrawerMenuParams,
  StoryStackParams,
  TicketStackParams,
} from "../Typings/route";
import { wp } from "../Utilities/Metrics";
import SettingsPayoutAccount from "../Screens/SettingsPayoutAccount";

const RootStack = createNativeStackNavigator<RootStackParams>();
const Auth = createNativeStackNavigator<AuthStackParams>();
const CameraDrawer = createDrawerNavigator<CameraDrawerParams>();
const SideDrawer = createDrawerNavigator<SideDrawerMenuParams>();
const Main = createNativeStackNavigator<MainStackParams>();
const Tabs = createBottomTabNavigator<BottomTabParams>();

const Settings = createNativeStackNavigator<SettingsStackParams>();
const SettingsAccountStack =
  createNativeStackNavigator<SettingsAccountStackParams>();
const AccountProfileInfo =
  createNativeStackNavigator<SettingsProfileInfoStackParams>();
const ChangeEmailAddressStack =
  createNativeStackNavigator<ChangeEmailStackParams>();
const ChangePhoneNumberStack =
  createNativeStackNavigator<ChangePhoneNumberStackParams>();
const PaymentStack = createNativeStackNavigator<SettingsPaymentStackParams>();
const PaymentMethodStack =
  createNativeStackNavigator<PaymentMethodStackParams>();
const BillingStack = createNativeStackNavigator<BillinhHistoryStackParams>();

const Story = createNativeStackNavigator<StoryStackParams>();
const PostDetailStack = createNativeStackNavigator<PostDetailStackParams>();

const TicketStack = createNativeStackNavigator<TicketStackParams>();
const ProfessionStack = createNativeStackNavigator<ProfessionalStackParams>();
const ReferralsStack = createNativeStackNavigator<ReferralsStackParams>();
const PremiumStack = createNativeStackNavigator<PremiumStackParams>();

// Memoized Stack Components - Created at module level to prevent re-creation
const ChangeEmailStackComponent = React.memo(() => (
  <ChangeEmailAddressStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <ChangeEmailAddressStack.Screen
      name="changeEmail"
      component={SettingsChangeEmail}
    />
    <ChangeEmailAddressStack.Screen
      name="verifyOtp"
      component={SettingsVerifyOtp}
    />
    <ChangeEmailAddressStack.Screen
      name="verifyPassword"
      component={SettingsVerifyPassword}
    />
  </ChangeEmailAddressStack.Navigator>
));

const ChangePhoneStackComponent = React.memo(() => (
  <ChangePhoneNumberStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <ChangePhoneNumberStack.Screen
      name="changePhoneNumber"
      component={SettingsChangePhoneNumber}
    />
    <ChangePhoneNumberStack.Screen
      name="phoneVerifyOtp"
      component={SettingsVerifyPhoneOtp}
    />
  </ChangePhoneNumberStack.Navigator>
));

const AccountProfileInfoStackComponent = React.memo(() => (
  <AccountProfileInfo.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <AccountProfileInfo.Screen
      name="profileInfo"
      component={SettingsProfileInfo}
    />
    <AccountProfileInfo.Screen
      name="changeEmailStack"
      component={ChangeEmailStackComponent}
    />
    <AccountProfileInfo.Screen
      name="changePhoneNumber"
      component={ChangePhoneStackComponent}
    />
    <AccountProfileInfo.Screen
      name="forgotPassword"
      component={SettingsForgotPassword}
    />
    <AccountProfileInfo.Screen
      name="passwordSecurity"
      component={SettingPasswordSecurity}
    />
    <AccountProfileInfo.Screen
      name="changePassword"
      component={SettingChangePassword}
    />
  </AccountProfileInfo.Navigator>
));

const SettingsAccountStackComponent = React.memo(() => (
  <SettingsAccountStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <SettingsAccountStack.Screen name="account" component={SettingsAccount} />
    <SettingsAccountStack.Screen
      name="profileInfoStack"
      component={AccountProfileInfoStackComponent}
    />
    <SettingsAccountStack.Screen
      name="privacyPrefrences"
      component={SettingPrivacyPrefrences}
    />
  </SettingsAccountStack.Navigator>
));

const PaymentMethodStackComponent = React.memo(() => (
  <PaymentMethodStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <PaymentMethodStack.Screen
      name="paymentMethod"
      component={SettingsPaymentMethod}
    />
    <PaymentMethodStack.Screen
      name="addPaymentMethod"
      component={SettingsAddPaymentMethod}
    />
  </PaymentMethodStack.Navigator>
));

const BillingHistoryStackComponent = React.memo(() => (
  <BillingStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <BillingStack.Screen
      name="billingHistory"
      component={SettingsBillingHistory}
    />
    <BillingStack.Screen
      name="recieptDetail"
      component={SettingsRecieptDetail}
    />
  </BillingStack.Navigator>
));

const PaymentsStackComponent = React.memo(() => (
  <PaymentStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <PaymentStack.Screen name="payment" component={SettingsPayment} />
    <PaymentStack.Screen
      name="paymentMethodStack"
      component={PaymentMethodStackComponent}
    />
    <PaymentStack.Screen
      name="billingHistoryStack"
      component={BillingHistoryStackComponent}
    />
    <PaymentStack.Screen
      name="subscriptionManagement"
      component={SettingsSubscriptions}
    />
    <PaymentStack.Screen
      name="payoutAccount"
      component={SettingsPayoutAccount}
    />
  </PaymentStack.Navigator>
));

const SettingsStackComponent = React.memo(() => (
  <Settings.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Settings.Screen name="settings" component={SettingsScreen} />
    <Settings.Screen
      name="accountStack"
      component={SettingsAccountStackComponent}
    />
    <Settings.Screen name="paymentsStack" component={PaymentsStackComponent} />
    <Settings.Screen name="helpSupport" component={SettingsHelpSupport} />
    <Settings.Screen
      name="settingNotification"
      component={SettingsNotification}
    />
  </Settings.Navigator>
));

const Routing = () => {
  function AuthStack() {
    return (
      <Auth.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Auth.Screen name="onBoarding" component={OnBoarding} />
        <Auth.Screen name="referral" component={Referral} />
        <Auth.Screen name="welcome" component={Welcome} />
        <Auth.Screen name="register" component={Register} />
        <Auth.Screen name="StartExploring" component={StartExploring} />
        <Auth.Screen name="signIn" component={SignIn} />
      </Auth.Navigator>
    );
  }

  function TabStack() {
    return (
      <Tabs.Navigator
        screenOptions={{
          headerShown: false,
        }}
        tabBar={(props) => <BottomTabBar {...props} />}
      >
        <Tabs.Screen
          options={{
            title: "Home",
          }}
          name="homeTab"
          component={Home}
        />
        <Tabs.Screen
          options={{
            title: "Social",
          }}
          name="datingTab"
          component={Dating}
        />
        <Tabs.Screen
          options={{
            title: "Events",
          }}
          name="eventsTab"
          component={Events}
        />
        <Tabs.Screen
          options={{
            title: "Messages",
          }}
          name="messagesTab"
          component={Messages}
        />
        <Tabs.Screen
          options={{
            title: "Profile",
          }}
          name="profileTab"
          component={Profile}
        />
      </Tabs.Navigator>
    );
  }

  function SettingStack() {
    return <SettingsStackComponent />;
  }

  function StoryStack() {
    return (
      <Story.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Story.Screen name="selectStoryMedia" component={StoryData} />
        <Story.Screen name="createStory" component={CreateStory} />
      </Story.Navigator>
    );
  }

  function PostDetailsStack() {
    return (
      <PostDetailStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <PostDetailStack.Screen name="postDetail" component={PostDetail} />
        <PostDetailStack.Screen name="reportPost" component={ReportPost} />
      </PostDetailStack.Navigator>
    );
  }

  function TicketssStack() {
    return (
      <TicketStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <TicketStack.Screen name="ticketList" component={Tickets} />
        <TicketStack.Screen name="ticketDetail" component={TicketDetails} />
        <TicketStack.Screen name="buyTicket" component={BuyTicket} />
        <TicketStack.Screen
          name="confirmOrder"
          component={ConfirmTicketOrder}
        />
        <TicketStack.Screen name="resellTicket" component={ResellTicket} />
        <TicketStack.Screen name="transferTicket" component={TransferTicket} />
      </TicketStack.Navigator>
    );
  }

  function ProfessionalStack() {
    return (
      <ProfessionStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <ProfessionStack.Screen name="professional" component={Professional} />
        <ProfessionStack.Screen
          name="professionRole"
          component={ProfessionRole}
        />
        <ProfessionStack.Screen
          name="createProfessionalProfile"
          component={CreateProfessionalProfile}
        />
        <ProfessionStack.Screen
          name="editProfessionalProfile"
          component={EditProfessionalProfile}
        />
        <ProfessionStack.Screen
          name="ProfessionalAccountDetails"
          component={ProfessionalAccountDetails}
        />
        <ProfessionStack.Screen name="Analytics" component={Analytics} />
        <ProfessionStack.Screen name="Bookings" component={Bookings} />
        <ProfessionStack.Screen name="Promotions" component={Promotions} />
        <ProfessionStack.Screen
          name="PromoteYourself"
          component={PromoteYourself}
        />
        <ProfessionStack.Screen
          name="PromotionBanner"
          component={PromotionBanner}
        />
        <ProfessionStack.Screen
          name="PromotionAnalytics"
          component={PromotionAnalytics}
        />
        <ProfessionStack.Screen name="MyEvents" component={MyEvents} />
        <ProfessionStack.Screen name="FeedBack" component={FeedBack} />
        <ProfessionStack.Screen name="PreviewEvent" component={PreviewEvent} />
      </ProfessionStack.Navigator>
    );
  }

  function ReferralsStackScreen() {
    return (
      <ReferralsStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <ReferralsStack.Screen
          name="sideDrawerRefferal"
          component={SideDrawerRefferal}
        />
        <ReferralsStack.Screen
          name="refferalWorking"
          component={RefferalWorking}
        />
      </ReferralsStack.Navigator>
    );
  }

  function PremiumStackScreens() {
    return (
      <PremiumStack.Navigator screenOptions={{ headerShown: false }}>
        <PremiumStack.Screen
          name="subscriptionManagement"
          component={SettingsSubscriptions}
        />
        <PremiumStack.Screen name="confirmOrder" component={ConfirmOrder} />
        <PremiumStack.Screen name="paymentDone" component={PaymentDone} />
      </PremiumStack.Navigator>
    );
  }

  // Main Stack Navigator - Handles all navigable screens
  function MainStackNavigator() {
    return (
      <Main.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Bottom Tabs - Initial Route */}
        <Main.Screen name="bottomTabs" component={TabStack} />

        {/* Top Navigation Screens */}
        <Main.Screen name="notification" component={Notifications} />
        <Main.Screen name="searchHome" component={SearchHome} />
        <Main.Screen name="maps" component={Maps} />
        <Main.Screen name="createEvent" component={CreateEvent} />

        {/* General Screens */}
        <Main.Screen name="userProfile" component={UserProfile} />
        <Main.Screen
          name="professionalProfileReview"
          component={ProfessionalProfileReview}
        />
        <Main.Screen name="matchScreen" component={MatchScreen} />
        <Main.Screen name="matchList" component={MatchList} />
        <Main.Screen name="reportScreen" component={Reports} />
        <Main.Screen name="createGroup" component={CreateGroup} />
        <Main.Screen name="myGroup" component={MyGroups} />
        <Main.Screen name="purchaseLikes" component={PurchaseLikes} />
        <Main.Screen name="editProfile" component={EditProfile} />
        <Main.Screen name="contactList" component={ContactList} />
        <Main.Screen name="createNewCommunity" component={CreateNewCommunity} />
        <Main.Screen name="blockedList" component={BlockedList} />

        {/* Chat Screens */}
        <Main.Screen name="chatSection" component={ChatSection} />
        <Main.Screen name="chatBackground" component={ChatBackground} />
        <Main.Screen name="previewBackground" component={PreviewBackground} />
        <Main.Screen
          name="groupMessagesPrivacy"
          component={GroupMessagesPrivacy}
        />
        <Main.Screen
          name="groupMessagesPermissions"
          component={GroupMessagesPermissions}
        />

        {/* Event Screens */}
        <Main.Screen name="eventDetail" component={EventDetails} />
        <Main.Screen name="singleEventDetail" component={SingleEventDetail} />
        <Main.Screen
          name="singleEventAnalytics"
          component={SingleEventAnalytics}
        />
        <Main.Screen name="eventBuyTicket" component={EventBuyTicket} />
        <Main.Screen
          name="ticketTermsConditions"
          component={TicketTermsConditions}
        />
        <Main.Screen name="eventOrderSummary" component={EventOrderSummary} />
        <Main.Screen name="myEventTicket" component={MyEventTicket} />
        <Main.Screen name="eventTicketDetail" component={EventTicketDetail} />
        <Main.Screen
          name="eventTicketSaleWithdrawl"
          component={EventTicketSaleWithdrawl}
        />
        <Main.Screen name="eventEditTicket" component={EventEditTicket} />
        <Main.Screen name="editMyEvent" component={EditMyEvent} />

        {/* Other Screens */}
        <Main.Screen name="commentScreen" component={CommentScreen} />
        <Main.Screen name="storyScreen" component={StoryScreen} />

        {/* Nested Stacks */}
        <Main.Screen name="postDetailStack" component={PostDetailsStack} />
        <Main.Screen name="storyStack" component={StoryStack} />
        <Main.Screen name="ticketStack" component={TicketssStack} />
        <Main.Screen name="bookProfessional" component={BookProfessional} />
      </Main.Navigator>
    );
  }

  // Left Drawer - Side Menu (Swipe from left)
  function SideDrawerStack() {
    return (
      <SideDrawer.Navigator
        drawerContent={(props) => <SideDrawerMenu {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            width: wp(100),
          },
          drawerPosition: "right",
        }}
      >
        {/* Main Stack - Initial Route */}
        <SideDrawer.Screen name="mainStack" component={MainStackNavigator} />

        {/* Drawer Menu Items */}
        <SideDrawer.Screen name="createPost" component={CreatePost} />
        <SideDrawer.Screen name="settingsStack" component={SettingStack} />
        <SideDrawer.Screen
          name="professionalStack"
          component={ProfessionalStack}
        />
        <SideDrawer.Screen
          name="premiumStack"
          component={PremiumStackScreens}
        />
        <SideDrawer.Screen
          name="referralsStack"
          component={ReferralsStackScreen}
        />
        <SideDrawer.Screen name="ticketScanner" component={TicketScanner} />
      </SideDrawer.Navigator>
    );
  }

  // Right Drawer - Camera (Swipe from left)
  // Wrapper component to track current tab and control camera gesture
  const CameraStackWrapper = () => {
    const [isHomeTab, setIsHomeTab] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
      let isMounted = true;

      const checkTabState = () => {
        try {
          const state = navigation.getState?.();
          if (!state || !isMounted) return;

          // Navigate through the state hierarchy to find the current tab
          let currentState = state;
          while (currentState?.routes) {
            const index = currentState.index ?? 0;
            const route = currentState.routes[index];
            
            if (route?.name === "bottomTabs" && route?.state?.routes) {
              const tabIndex = route.state.index ?? 0;
              const currentTab = route.state.routes[tabIndex]?.name;
              setIsHomeTab(currentTab === "homeTab");
              break;
            }
            
            currentState = route?.state;
          }
        } catch (error) {
          console.error("Error checking tab state:", error);
        }
      };

      const unsubscribe = navigation.addListener("state", checkTabState);
      
      // Check initial state
      checkTabState();

      return () => {
        isMounted = false;
        unsubscribe?.();
      };
    }, [navigation]);

    return (
      <CameraDrawer.Navigator
        drawerContent={(props) => <CameraSideDrawer {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            width: wp(100),
          },
          drawerPosition: "left",
          swipeEnabled: isHomeTab, // Enable swipe only on Home tab
        }}
      >
        {/* Left Drawer - Side Menu (Swipe from left) */}
        <CameraDrawer.Screen name="sideDrawer" component={SideDrawerStack} />
      </CameraDrawer.Navigator>
    );
  };

  function CameraStack() {
    return <CameraStackWrapper />;
  }

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <RootStack.Screen name="splash" component={Splash} />
      <RootStack.Screen name="authStack" component={AuthStack} />
      <RootStack.Screen name="cameraDrawerStack" component={CameraStack} />
    </RootStack.Navigator>
  );
};

export default Routing;
