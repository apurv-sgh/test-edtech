import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useMemo } from "react";
import { Plus, Trash2, Save, Eye, FileText, Clock, Users } from "lucide-react";
import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api/questionpapers";

export default function QuestionPaperCreator() {
  const [paperId, setPaperId] = useState(null);
  const [paperTitle, setPaperTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [instructions, setInstructions] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    type: "multiple-choice",
    question: "",
    options: ["", "", "", ""],
    points: 1,
    correctAnswer: null,
  });

  const [allPapers, setAllPapers] = useState([]); // To store a list of all papers
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Get real user from AuthContext
  const { user } = useAuth();
  // Always get the unique user id for the current user (supports both _id and id)
  // This value is different for every logged-in user
  const userId = useMemo(() => {
    if (!user) return undefined;
    return user._id || user.id;
  }, [user]);

  // Wait for user to be loaded before allowing save
  const [authReady, setAuthReady] = useState(false);
  useEffect(() => {
    if (user && (user._id || user.id)) {
      setAuthReady(true);
    } else {
      setAuthReady(false);
    }
  }, [user]);


  // Helper function
  const getTotalPoints = () => {
    return questions.reduce((sum, q) => sum + q.points, 0);
  };

  const clearForm = () => {
    setPaperId(null);
    setPaperTitle("");
    setSubject("");
    setDuration("");
    setTotalMarks("");
    setInstructions("");
    setQuestions([]);
    setCurrentQuestion({
      type: "multiple-choice",
      question: "",
      options: ["", "", "", ""],
      points: 1,
      correctAnswer: null,
    });
  };

  const addQuestion = () => {
    if (!currentQuestion.question) {
      alert("Question text cannot be empty.");
      return;
    }

    const newQuestion = {
      id: Date.now().toString(),
      type: currentQuestion.type,
      question: currentQuestion.question,
      options:
        currentQuestion.type === "multiple-choice" || currentQuestion.type === "true-false"
          ? currentQuestion.options.filter(opt => opt.trim() !== "") // Filter out empty options if not true/false
          : undefined,
      correctAnswer: currentQuestion.correctAnswer,
      points: currentQuestion.points || 1,
    };

    setQuestions([...questions, newQuestion]);
    setCurrentQuestion({
      type: "multiple-choice",
      question: "",
      options: ["", "", "", ""],
      points: 1,
      correctAnswer: null,
    });
  };


  const removeQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };


  const updateCurrentQuestionOption = (index, value) => {
    const newOptions = [...(currentQuestion.options || [])];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  // API Interactions

  // Fetch all papers for the list
  const fetchAllPapers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAllPapers(data);
    } catch (err) {
      console.error("Failed to fetch papers:", err);
      setError("Failed to load existing papers.");
    } finally {
      setLoading(false);
    }
  };

  // Load a specific paper for editing
 const loadPaperForEdit = async (id) => {
    setLoading(true);
    setError(null);
    clearForm(); // Clear current form before loading new data
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`); // Using axios
      const data = response.data;
      setPaperId(data._id);
      setPaperTitle(data.paperTitle); // FIX: Use data.paperTitle, not data.title
      setSubject(data.subject);
      setDuration(data.duration.toString()); // Ensure it's a string for input value
      setTotalMarks(data.totalMarks.toString()); // Ensure it's a string for input value
      setInstructions(data.instructions);
      // FIX: Map options back to array of strings for frontend display
      setQuestions(data.questions.map(q => ({
        ...q,
        id: q.id || q._id, // Ensure frontend can use 'id'
        options: q.options ? q.options.map(opt => opt.value) : undefined // Convert [{value: "A"}] to ["A"]
      })));
    } catch (err) {
      console.error(err);
      setError("Failed to load the selected paper.");
    } finally {
      setLoading(false);
    }
  };

  const savePaper = async () => {
    setIsSaving(true);
    setError(null);

    // Basic validation
    if (!paperTitle || !subject || !duration || !totalMarks) {
      alert("Please fill in all paper details.");
      setIsSaving(false);
      return;
    }
    if (questions.length === 0) {
      alert("Please add at least one question.");
      setIsSaving(false);
      return;
    }

    const paperData = {
      paperTitle,
      subject,
      duration: parseInt(duration),
      totalMarks: parseInt(totalMarks),
      instructions,
      questions: questions.map(q => ({
        ...q,
        options: q.options ? q.options.map(opt => opt) : undefined
      }))
    };
    try {
      let response;
      if (paperId) {
        // Update existing paper
        response = await fetch(`${API_BASE_URL}/${paperId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paperData),
        });
      } else {
        // Create new paper
        response = await fetch(API_BASE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paperData)
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save data");
      }

      const savedPaper = await response.json();
      alert(`Paper ${paperId ? "updated" : "saved"} successfully!`);
      clearForm(); // Clear form after successfull save
      fetchAllPapers(); // Refersh the list of papers
    } catch (err) {
      consol.log("Failed to save paper: ", err);
      setError("Failed to save paper.");
    } finally {
      setIsSaving(false);
    }
  };

  const saveOrUpdatePaper = async () => {

  // Debug: log user and userId
  console.log("[DEBUG] user:", user);
  console.log("[DEBUG] userId:", userId);

    if (!authReady) {
      alert("User authentication is still loading. Please wait and try again.");
      return;
    }
    if (!userId) {
      alert("You must be logged in to save a question paper.");
      return;
    }
    if (!paperTitle || !subject || !duration || !totalMarks) {
      alert("Please fill in all paper details.");
      return;
    }
    if (questions.length === 0) {
      alert("Please add at least one question.");
      return;
    }


    // Convert questions to match backend schema: 'questions' and options as [{value: ...}]
    const paperData = {
      paperTitle,
      subject,
      duration: parseInt(duration),
      totalMarks: parseInt(totalMarks),
      instructions,
      questions: questions.map(q => ({
        ...q,
        id: q.id || new Date().getTime().toString() + Math.random().toString(36).substr(2, 9),
        question: q.question,
        options: q.options ? q.options.map(opt => ({ value: opt })) : [],
      })),
  user: userId // Real user id from AuthContext
    };

    try {
      if (paperId) {
        // Update existing paper
        await axios.put(`${API_BASE_URL}/${paperId}`, paperData);
        alert("Question paper updated successfully!");
      } else {
        // Save new paper
        await axios.post(API_BASE_URL, paperData);
        alert("Question paper saved successfully!");
      }
      clearForm();
      fetchAllPapers(); // Refresh the list of papers
    } catch (err) {
      console.error("Error saving/updating paper:", err);
      alert("Failed to save/update question paper. Please try again.");
    }
  };

  const deletePaper = async (id) => {
    if (!window.confirm("Are you sure you want to delete this paper?")) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete paper");
      }

      alert("Paper deleted successfully!");
      if (paperId === idToDelete) {
        clearForm(); // Clear the form if the currently edited paper was deleted
      }
      fetchAllPapers(); // Refresh the list of papers.
    } catch (err) {
      console.error("Failed to delete paper: ", err);
      setError("Failed to delete paper.");
      alert(`Error deleting paper: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Effect
  useEffect(() => {
    fetchAllPapers(); // Load all papers on component mount
  }, []); // empty dependency array means this runs once on mount



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-600 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Question Paper Creator</h1>
              <p className="text-gray-600">Create and manage question papers for your students</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Questions</p>
                    <p className="text-2xl font-bold text-gray-900">{questions.length}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Points</p>
                    <p className="text-2xl font-bold text-gray-900">{getTotalPoints()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Clock className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="text-2xl font-bold text-gray-900">{duration || "0"} min</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Paper Details & Question Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Paper Details */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">{paperId ? "Edit Paper Details" : "New Paper Details"}</h2>
                <p className="text-gray-600 text-sm mt-1">Set up the basic information for your question paper</p>
              </div>
              {paperId && (
                <button
                  onClick={clearForm}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <Plus className="inline-block h-4 w-4 mr-1" />Create New
                </button>
              )}
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-gray-700">
                    Paper Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Mathematics Mid-term Exam"
                    value={paperTitle}
                    onChange={(e) => setPaperTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Mathematics"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="duration" className="text-sm font-medium text-gray-700">
                    Duration (minutes)
                  </label>
                  <input
                    id="duration"
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 120"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="marks" className="text-sm font-medium text-gray-700">
                    Total Marks
                  </label>
                  <input
                    id="marks"
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 100"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="instructions" className="text-sm font-medium text-gray-700">
                  Instructions
                </label>
                <textarea
                  id="instructions"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter exam instructions for students..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {/* Add Question Form */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Add New Question</h2>
                <p className="text-gray-600 text-sm mt-1">Create questions for your paper</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="questionType" className="text-sm font-medium text-gray-700">
                      Question Type
                    </label>
                    <select
                      id="questionType"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={currentQuestion.type}
                      onChange={(e) =>
                        setCurrentQuestion({
                          ...currentQuestion,
                          type: e.target.value,
                          options:
                            e.target.value === "true-false"
                              ? ["True", "False"]
                              : e.target.value === "multiple-choice"
                                ? ["", "", "", ""]
                                : undefined,
                          correctAnswer: null, // Reset correct answer on type change
                        })
                      }
                    >
                      <option value="multiple-choice">Multiple Choice</option>
                      <option value="short-answer">Short Answer</option>
                      <option value="essay">Essay</option>
                      <option value="true-false">True/False</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="points" className="text-sm font-medium text-gray-700">
                      Points
                    </label>
                    <input
                      id="points"
                      type="number"
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={currentQuestion.points}
                      onChange={(e) =>
                        setCurrentQuestion({
                          ...currentQuestion,
                          points: Number.parseInt(e.target.value) || 1,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="question" className="text-sm font-medium text-gray-700">
                    Question
                  </label>
                  <textarea
                    id="question"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your question here..."
                    value={currentQuestion.question}
                    onChange={(e) =>
                      setCurrentQuestion({
                        ...currentQuestion,
                        question: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>

                {(currentQuestion.type === "multiple-choice" || currentQuestion.type === "true-false") && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Options</label>
                    {currentQuestion.options?.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500 w-8">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Option ${String.fromCharCode(65 + index)}`}
                          value={option}
                          onChange={(e) => updateCurrentQuestionOption(index, e.target.value)}
                          disabled={currentQuestion.type === "true-false"}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={addQuestion}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Question
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Questions List */}
          <div className="space-y-6">
            {/* Existing Papers */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Questions ({questions.length})</h2>
                <p className="text-gray-600 text-sm mt-1">Review and manage your questions</p>
              </div>
              <div className="p-6">
                {questions.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No questions added yet</p>
                    <p className="text-sm text-gray-400">Start by adding your first question</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-500">Q{index + 1}</span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                              {question.type.replace("-", " ")}
                            </span>
                            <span className="px-2 py-1 border border-gray-300 text-gray-600 text-xs rounded-md">
                              {question.points} pts
                            </span>
                          </div>
                          <button
                            onClick={() => removeQuestion(question.id)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-900 mb-2">{question.question}</p>
                        {question.options && (
                          <div className="space-y-1">
                            {question.options.map((option, optIndex) => (
                              <p key={optIndex} className="text-xs text-gray-600">
                                {String.fromCharCode(65 + optIndex)}. {option}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={saveOrUpdatePaper}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : (paperId ? "Update Paper" : "Save New Paper")}
              </button>
              <button
                onClick={() => setShowPreview(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <Eye className="h-4 w-4" />
                Preview Paper
              </button>
            </div>
          </div>
        </div>
      </div>
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h2 className="text-2xl font-bold">Paper Preview</h2>
              <button onClick={() => setShowPreview(false)} className="text-gray-500 hover:text-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold">{paperTitle}</h3>
                <p className="text-gray-600">{subject}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p>
                  <strong>Duration:</strong> {duration} minutes
                </p>
                <p>
                  <strong>Total Marks:</strong> {totalMarks}
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Instructions:</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{instructions}</p>
              </div>
              <hr />
              <div>
                <h4 className="font-semibold mb-4">Questions:</h4>
                <div className="space-y-4">
                  {questions.map((q, index) => (
                    <div key={q.id}>
                      <p className="font-medium">
                        {index + 1}. {q.question} ({q.points} {q.points > 1 ? 'points' : 'point'})
                      </p>
                      {q.options && (
                        <div className="ml-4 mt-2 space-y-1">
                          {q.options.map((option, optIndex) => (
                            <p key={optIndex} className="text-gray-700">
                              {String.fromCharCode(65 + optIndex)}. {option}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
