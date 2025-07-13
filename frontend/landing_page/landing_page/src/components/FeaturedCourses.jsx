import { Code, BrainCircuit, LineChart, MessageSquare, ArrowRight } from "lucide-react";
import Avatar1 from "../assets/avatars/alan.png";
import Avatar2 from "../assets/avatars/emma.png";
import Avatar3 from "../assets/avatars/john.png";

const courses = [
    {
        icon: <Code className="w-6 h-6 text-blue-500" />,
        title: "Web Development",
        desc: 'Master HTML, CSS, and JavaScript and modern frameworks like React and Vue.',
        instructor: 'Mr.Alex Simth',
        avatar: Avatar1,
        lessons: 12,
    },
    {
        icon: <BrainCircuit className="w-6 h-6 text-orange-500" />,
        title: 'Cognitive Science',
        desc: 'Explore the science behind thinking & learning with engaging video lectures.',
        instructor: 'Ms. Linda Lee',
        avatar: Avatar2,
        progress: 34
    },
    {
        icon: <LineChart className="w-6 h-6 text-green-500" />,
        title: 'Business Analytics',
        desc: 'Learn data-driven decision making with hands-on business analytics lessons.',
        instructor: 'Mr. John May',
        avatar: Avatar3,
        lessons: 19
    },
];

const CourseCard = ({ course }) => {
    <div className="bg-white p-6 rounded-2xl shadow-card space-y-4">
        <div className="flex items-center gap-4">
            <div className="bg-primary-light p-3 rounded-lg">{course.icon}</div>
            <h3 className="text-xl font-bold text-dark-purple">{course.title}</h3>
        </div>
        <p className="text-gray-text">{course.desc}</p>
        <div className="flex justify-between items-center pt-2">
            <div className="flex items-center gap-2">
                <img src={course.avatar} alt={course.instructor} className="w-8 h-8 rounded-full" />
                <span className="text-sm font-medium text-dark-purple">{course.instructor}</span>
            </div>
            {course.progress ? (
                <div className="w-24 bg-gray-200 rounded-full h-1.5">
                    <div className="bg-orange-400 h-1.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                </div>
            ) : (
                <div className="flex items-center gap-1 text-blue-500 text-sm font-medium">
                    <MessageSquare className="w-4 h-4" />
                    <span>{course.lessons}</span>
                </div>
            )}
        </div>
    </div>
};

const FeaturedCourses = () => {
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="contaienr mx-auto px-4">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold text-dark-purple">Featured Courses</h2>
                    <a href="#" className="flex items-center gap-2 text-primary font-semibold">
                        View All Courses <ArrowRight className="w-5 h-5" />
                    </a>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course, index) => {
                        <CourseCard key={index} course={course} />
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCourses;