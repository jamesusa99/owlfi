import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Classroom from './pages/Classroom'
import Portfolio from './pages/Portfolio'
import Tools from './pages/Tools'
import Profile from './pages/Profile'
import ToolRiskAssessment from './pages/ToolRiskAssessment'
import ToolSIPCalculator from './pages/ToolSIPCalculator'
import ToolCompound from './pages/ToolCompound'
import ToolFundCompare from './pages/ToolFundCompare'
import ToolAssetConfig from './pages/ToolAssetConfig'
import ToolInflation from './pages/ToolInflation'
import PortfolioDetail from './pages/PortfolioDetail'
import PortfolioCreate from './pages/PortfolioCreate'
import PortfolioRebalance from './pages/PortfolioRebalance'
import PortfolioFollow from './pages/PortfolioFollow'
import PortfolioFollowConfirm from './pages/PortfolioFollowConfirm'
import PortfolioSubscribe from './pages/PortfolioSubscribe'
import PortfolioRedeem from './pages/PortfolioRedeem'
import SubscribeSuccess from './pages/SubscribeSuccess'
import RedeemSuccess from './pages/RedeemSuccess'
import ChatSupport from './pages/ChatSupport'
import RebalanceSuccess from './pages/RebalanceSuccess'
import FollowSuccess from './pages/FollowSuccess'
import FundDetail from './pages/FundDetail'
import CourseDetail from './pages/CourseDetail'
import CourseLearn from './pages/CourseLearn'
import TopicList from './pages/TopicList'
import NewsList from './pages/NewsList'
import NewsDetail from './pages/NewsDetail'
import ProfileOrders from './pages/ProfileOrders'
import ProfileCards from './pages/ProfileCards'
import ProfileCardAdd from './pages/ProfileCardAdd'
import ProfileNotifications from './pages/ProfileNotifications'
import ProfileHelp from './pages/ProfileHelp'
import ProfileHelpFaqList from './pages/ProfileHelpFaqList'
import ProfileHelpFaq from './pages/ProfileHelpFaq'
import ProfileHelpAbout from './pages/ProfileHelpAbout'
import ProfileSettings from './pages/ProfileSettings'
import ProfileSettingsSecurity from './pages/ProfileSettingsSecurity'
import ProfileSettingsNotification from './pages/ProfileSettingsNotification'
import ProfileSettingsPrivacy from './pages/ProfileSettingsPrivacy'
import ProfileSupport from './pages/ProfileSupport'
import ProfileFeedback from './pages/ProfileFeedback'
import ProfileTasks from './pages/ProfileTasks'
import ProfilePointsMall from './pages/ProfilePointsMall'
import ProfileActivities from './pages/ProfileActivities'
import ProfileMarketMall from './pages/ProfileMarketMall'
import ProfileRewards from './pages/ProfileRewards'
import ProfileCoupons from './pages/ProfileCoupons'
import ProfileAntiFraud from './pages/ProfileAntiFraud'
import ProfileAssociatedAccount from './pages/ProfileAssociatedAccount'
import ChangePassword from './pages/ChangePassword'
import ChangePhone from './pages/ChangePhone'
import UserAgreement from './pages/UserAgreement'
import PrivacyPolicy from './pages/PrivacyPolicy'
import OrderDetail from './pages/OrderDetail'
import NotificationDetail from './pages/NotificationDetail'
import CardAddSuccess from './pages/CardAddSuccess'
import FeedbackSuccess from './pages/FeedbackSuccess'
import Login from './pages/Login'
import Forum from './pages/Forum'
import ForumPost from './pages/ForumPost'
import ForumCreate from './pages/ForumCreate'
import FundDiagnosis from './pages/FundDiagnosis'
import FundDiagnosisResult from './pages/FundDiagnosisResult'
import ResearchReports from './pages/ResearchReports'
import ResearchReportDetail from './pages/ResearchReportDetail'
import TreasureZone from './pages/TreasureZone'
import RoadshowCalendar from './pages/RoadshowCalendar'
import RoadshowDetail from './pages/RoadshowDetail'
import FundProfile from './pages/FundProfile'
import MarketIndicators from './pages/MarketIndicators'
import MarketIndicatorDetail from './pages/MarketIndicatorDetail'
import ClassroomCategory from './pages/ClassroomCategory'
import HotNews from './pages/HotNews'
import InstitutionalClients from './pages/InstitutionalClients'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="classroom" element={<Classroom />} />
          <Route path="classroom/category/:cat" element={<ClassroomCategory />} />
          <Route path="classroom/topic/:tag" element={<TopicList />} />
          <Route path="classroom/course/:id" element={<CourseDetail />} />
          <Route path="classroom/course/:id/learn/:lessonId" element={<CourseLearn />} />
          <Route path="classroom/course/:id/learn" element={<CourseLearn />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="portfolio/create" element={<PortfolioCreate />} />
          <Route path="portfolio/follow" element={<PortfolioFollow />} />
          <Route path="portfolio/follow/success" element={<FollowSuccess />} />
          <Route path="portfolio/follow/:id/confirm" element={<PortfolioFollowConfirm />} />
          <Route path="portfolio/:id/rebalance" element={<PortfolioRebalance />} />
          <Route path="portfolio/:id/rebalance/success" element={<RebalanceSuccess />} />
          <Route path="portfolio/:id/subscribe" element={<PortfolioSubscribe />} />
          <Route path="portfolio/:id/subscribe/success" element={<SubscribeSuccess />} />
          <Route path="portfolio/:id/redeem" element={<PortfolioRedeem />} />
          <Route path="portfolio/:id/redeem/success" element={<RedeemSuccess />} />
          <Route path="portfolio/:id" element={<PortfolioDetail />} />
          <Route path="fund/:code" element={<FundDetail />} />
          <Route path="tools" element={<Tools />} />
          <Route path="tools/risk" element={<ToolRiskAssessment />} />
          <Route path="tools/sip" element={<ToolSIPCalculator />} />
          <Route path="tools/compound" element={<ToolCompound />} />
          <Route path="tools/fund-compare" element={<ToolFundCompare />} />
          <Route path="tools/asset-config" element={<ToolAssetConfig />} />
          <Route path="tools/inflation" element={<ToolInflation />} />
          <Route path="news" element={<NewsList />} />
          <Route path="news/hot" element={<HotNews />} />
          <Route path="news/:id" element={<NewsDetail />} />
          <Route path="research/diagnosis" element={<FundDiagnosis />} />
          <Route path="research/diagnosis/result/:code" element={<FundDiagnosisResult />} />
          <Route path="research/reports" element={<ResearchReports />} />
          <Route path="research/reports/:id" element={<ResearchReportDetail />} />
          <Route path="treasure" element={<TreasureZone />} />
          <Route path="roadshow" element={<RoadshowCalendar />} />
          <Route path="roadshow/:id" element={<RoadshowDetail />} />
          <Route path="research/fund-profile" element={<FundProfile />} />
          <Route path="market/indicators" element={<MarketIndicators />} />
          <Route path="market/indicators/:name" element={<MarketIndicatorDetail />} />
          <Route path="institutional" element={<InstitutionalClients />} />
          <Route path="forum" element={<Forum />} />
          <Route path="forum/post/:id" element={<ForumPost />} />
          <Route path="forum/create" element={<ProtectedRoute><ForumCreate /></ProtectedRoute>} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/tasks" element={<ProfileTasks />} />
          <Route path="profile/points-mall" element={<ProfilePointsMall />} />
          <Route path="profile/activities" element={<ProfileActivities />} />
          <Route path="profile/market-mall" element={<ProfileMarketMall />} />
          <Route path="profile/rewards" element={<ProfileRewards />} />
          <Route path="profile/coupons" element={<ProfileCoupons />} />
          <Route path="profile/anti-fraud" element={<ProfileAntiFraud />} />
          <Route path="profile/associated-account" element={<ProfileAssociatedAccount />} />
          <Route path="profile/orders" element={<ProtectedRoute><ProfileOrders /></ProtectedRoute>} />
          <Route path="profile/cards" element={<ProtectedRoute><ProfileCards /></ProtectedRoute>} />
          <Route path="profile/cards/add" element={<ProtectedRoute><ProfileCardAdd /></ProtectedRoute>} />
          <Route path="profile/notifications" element={<ProtectedRoute><ProfileNotifications /></ProtectedRoute>} />
          <Route path="profile/help" element={<ProfileHelp />} />
          <Route path="profile/help/faq" element={<ProfileHelpFaqList />} />
          <Route path="profile/help/faq/:id" element={<ProfileHelpFaq />} />
          <Route path="profile/help/about" element={<ProfileHelpAbout />} />
          <Route path="profile/settings" element={<ProfileSettings />} />
          <Route path="profile/settings/security" element={<ProtectedRoute><ProfileSettingsSecurity /></ProtectedRoute>} />
          <Route path="profile/settings/notification" element={<ProtectedRoute><ProfileSettingsNotification /></ProtectedRoute>} />
          <Route path="profile/settings/privacy" element={<ProtectedRoute><ProfileSettingsPrivacy /></ProtectedRoute>} />
          <Route path="profile/support" element={<ProtectedRoute><ProfileSupport /></ProtectedRoute>} />
          <Route path="profile/support/chat" element={<ProtectedRoute><ChatSupport /></ProtectedRoute>} />
          <Route path="profile/feedback" element={<ProtectedRoute><ProfileFeedback /></ProtectedRoute>} />
          <Route path="profile/feedback/success" element={<FeedbackSuccess />} />
          <Route path="profile/orders/:id" element={<OrderDetail />} />
          <Route path="profile/notifications/:id" element={<NotificationDetail />} />
          <Route path="profile/cards/add/success" element={<CardAddSuccess />} />
          <Route path="profile/settings/security/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
          <Route path="profile/settings/security/change-phone" element={<ProtectedRoute><ChangePhone /></ProtectedRoute>} />
          <Route path="profile/help/user-agreement" element={<UserAgreement />} />
          <Route path="profile/help/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
