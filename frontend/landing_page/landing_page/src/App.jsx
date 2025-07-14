import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import Features from './pages/Features';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
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


function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {/* <Route index element={<Bubbles />} /> */}
          <Route path="features" element={<Features />} />
          <Route path="contact" element={<Contact />} />
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
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
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
          <Route path="channels/:channelId" element={<ChannelChat />} />
          <Route path="quizzes" element={<Quizzes />} />
          <Route path="liveclasses" element={<LiveClasses />} />
          <Route path="tests" element={<Tests />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;