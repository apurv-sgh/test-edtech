import { Routes, Route } from 'react-router-dom';
import { Bubbles } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import Features from './pages/Features';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import DomainDetailsPage from './pages/DomainDetailsPage';
import CourseHubPage from './pages/CourseHubPage';
import SubjectDetailsPage from './pages/SubjectDetailsPage';
import LectureTitle from './components/LectureTitle';
import LiveClassesPage from './pages/LiveClassesPage';
import OpportunityPage from './pages/OpportunityPage';
import ChannelProfilePage from './pages/ChannelProfilePage';
import Courses from './components/Courses';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Notes from './components/Notes';
import Quizzes from './components/Quizzes';
import Discussions from './components/Discussions';
import CourseDiscussions from './components/CourseDiscussions';
import LiveClasses from './components/LiveClasses';
import Chat from './components/Chat';
import StudyPlan from './components/StudyPlan';
import Tests from './components/Tests';
import Profile from './pages/Profile';
import CourseDetails from './pages/CourseDetails';
import DashboardLayout from './components/dashboard/Layout';
import DashboardCourses from './components/dashboard/Courses';
import DashboardNotes from './components/dashboard/Notes';
import DashboardStudyPlan from './components/dashboard/StudyPlan';
import DashboardDiscussions from './components/dashboard/Discussions';
import Channels from './components/dashboard/Channels';
import ChannelChat from './components/dashboard/ChannelChat';
import { DashboardProvider } from './context/DashboardContext';
import CreateClassPage from './pages/CreateClassPage';
import RecordedLecturePage from './pages/RecordedLecturePage';
import StudentLogin from './pages/StudentLogin';
import StudentSignUp from './pages/StudentSignup';
import TeacherLogin from './pages/TeacherLogin';
import TeacherSignUp from './pages/TeacherSignUp';
import TeacherDashboard from './pages/TeacherDashboard';
import TestSeriesPage from './pages/TestSeries';
import CompetitionsPage from './pages/CompetitionsPage';
import QuizzesPage from './pages/QuizzesPage';
import Activity from './pages/Activity';
import TeacherDashboardLayout from './components/teacher_dashboard/Dashboardlayout';
import CourseManagementPage from './pages/CourseManagementPage';
import ChannelManagementPage from './pages/ChannelManagementPage';
import ChannelChatPage from './pages/ChannelChatPage';
import UploadNotesPage from './pages/UploadNotesPage';
import UploadVideosPage from './pages/UploadVideosPage';
import SettingsPage from './pages/SettingsPage';
// import CoursesPage from './pages/Courses';
import TeachersPage from './pages/Teachers';
import CategoriesPage from './pages/Categories';
import Bookings from './components/dashboard/Bookings';
import BecomeCounsellorForm from './components/counsellors/BecomeCounsellorForm';
import Counsellors from './components/counsellors/Counsellors';
import CounsellorProfile from './components/counsellors/CounsellorProfile';
import CounsellorDashboard from './components/counsellors/CounsellorDashboard';
import CounsellorLogin from './components/counsellors/CounsellorLogin';
import CounsellorRegister from './components/counsellors/CounsellorRegister';
import IndustryExpertsSection from './components/experts/IndustryExpertsSection';
import IndustryExperts from './components/experts/IndustryExperts';
import IndustryExpertProfile from './components/experts/IndustryExpertProfile';
import IndustryExpertDashboard from './components/experts/IndustryExpertDashboard';
import BecomeIndustryExpertForm from './components/experts/BecomeIndustryExpertForm';
import TestInstructionsPage from './components/TestInstructionsPage';
import TestPage from './components/TestPage';
import { mockQuestions } from './data/mockQuestions';
import QuestionEditor from './components/QuestionEditor';
import HackathonPage from './components/HackathonPage';

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="features" element={<Features />} />
          <Route path="contact" element={<Contact />} />
          <Route index element={<Bubbles />} />

          {/* <Route path="courses" element={<CoursesPage />} /> */}
          <Route path="teachers" element={<TeachersPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="/courses/:categorySlug" element={<CourseHubPage />} />
          <Route path="/courses/:categorySlug/:subjectSlug" element={<SubjectDetailsPage />} />

          <Route path="/channel/:channelSlug" element={<ChannelProfilePage />} />
          <Route path="/opportunity/:opportunitySlug" element={<OpportunityPage />} />

          <Route path='/test-series' element={<TestSeriesPage />} />
          <Route path="/competitions" element={<CompetitionsPage />} />
          <Route path='/quizzes' element={<QuizzesPage />} />

          <Route path='/live-classes' element={<LiveClassesPage />} />
          <Route path="/recorded-lecture" element={<RecordedLecturePage />} />
          <Route path='/live-classes' element={<CreateClassPage />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />

          <Route path="/domain-details/:domainSlug" element={<DomainDetailsPage />} />

          <Route path='/lecture' element={<LectureTitle />} />
          <Route path="courses" element={<Courses />} />
          <Route path="notes" element={<Notes />} />
          <Route path="quizzes" element={<Quizzes />} />
          <Route path="discussions" element={<Discussions />} />
          <Route path="discussions/course/:courseId" element={<CourseDiscussions />} />
          <Route path="liveclasses" element={<LiveClasses />} />
          <Route path="chat" element={<Chat />} />
          <Route path="studyplan" element={<StudyPlan />} />
          <Route path="tests" element={<Tests />} />
          <Route path="course/:courseId" element={<CourseDetails />} />
          <Route path="/test-instructions" element={<TestInstructionsPage />} />
          <Route path="/test-page" element={ <TestPage questions={mockQuestions} />} />
          <Route path='/question-editor' element={ <QuestionEditor />} />
          <Route path='/hackathon' element={<HackathonPage />} />
        
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path='/teacher-dashboard' element={<TeacherDashboardLayout />}>
          <Route index element={<TeacherDashboard />} />
          <Route path="courses" element={<CourseManagementPage />} />
          <Route path='communities' element={<ChannelManagementPage />} />
          <Route path='channel/:channelId' element={<ChannelChatPage />} />
          <Route path='upload-notes' element={<UploadNotesPage />} />
          <Route path='upload-videos' element={<UploadVideosPage />} />
          <Route path='settings' element={<SettingsPage />} />
        </Route>


        {/* <Route path="/login" element={<StudentLogin />} />
        <Route path="/signup" element={<StudentSignUp />} />
        <Route path="/teacher-login" element={<TeacherLogin />} />
        <Route path="/teacher-signup" element={<TeacherSignUp />} /> */}

        <Route path="/profile" element={
          <DashboardProvider>
            <DashboardLayout />
          </DashboardProvider>
        }>
          <Route index element={<Profile />} />
          <Route path="courses" element={<DashboardCourses />} />
          <Route path="notes" element={<DashboardNotes />} />
          <Route path="studyplan" element={<DashboardStudyPlan />} />
          <Route path="discussions" element={<DashboardDiscussions />} />
          <Route path="channels" element={<Channels />} />
          <Route path="discussions/course/:courseId" element={<DashboardDiscussions />} />
          <Route path="channels/:channelId" element={<ChannelChat />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="quizzes" element={<Quizzes />} />
          <Route path="liveclasses" element={<LiveClasses />} />
          <Route path="tests" element={<Tests />} />
          <Route path="/profile/your-activity" element={<Activity />} />
        </Route>

        <Route path="/become-counsellor" element={<BecomeCounsellorForm />} />
        <Route path="/counsellors" element={<Counsellors />} />
        <Route path="/counsellors/:id" element={<CounsellorProfile />} />
        <Route path="/counsellor/dashboard" element={<CounsellorDashboard />} />
        <Route path="/counsellor/login" element={<CounsellorLogin />} />
        <Route path="/counsellor/register" element={<CounsellorRegister />} />

        <Route path="/industry-experts" element={<IndustryExpertsSection />} />
        <Route path="/all-industry-experts" element={<IndustryExperts />} />
        <Route path="/industry-experts/:id" element={<IndustryExpertProfile />} />
        <Route path="/industry-experts/dashboard" element={<IndustryExpertDashboard />} />
        <Route path="/become-industry-expert" element={<BecomeIndustryExpertForm />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;