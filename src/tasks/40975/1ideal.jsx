import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const GradeCalculator = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ name: "", credits: "" });
  const [newAssignments, setNewAssignments] = useState({});

  // Add a new course
  const addCourse = () => {
    if (newCourse.name.trim()) {
      const courseId = Date.now(); // Unique ID for the course
      setCourses((prevCourses) => [
        ...prevCourses,
        {
          ...newCourse,
          id: courseId,
          assignments: [],
          targetGrade: 90,
        },
      ]);
      setNewCourse({ name: "", credits: "" });
      setNewAssignments((prev) => ({
        ...prev,
        [courseId]: { name: "", weight: 0, score: 0 },
      }));
    }
  };

  // Add a new assignment to a specific course
  const addAssignment = (courseId) => {
    const assignment = newAssignments[courseId];
    if (!assignment || assignment.name.trim() === "") {
      alert("Assignment name cannot be empty.");
      return;
    }

    // Validate weight and score
    if (
      isNaN(assignment.weight) ||
      assignment.weight <= 0 ||
      assignment.weight > 100
    ) {
      alert("Assignment weight must be between 1 and 100.");
      return;
    }
    if (
      isNaN(assignment.score) ||
      assignment.score < 0 ||
      assignment.score > 100
    ) {
      alert("Assignment score must be between 0 and 100.");
      return;
    }

    // Check if total weight exceeds 100
    const course = courses.find((c) => c.id === courseId);
    const totalWeight = course.assignments.reduce(
      (sum, a) => sum + a.weight,
      0
    );
    if (totalWeight + assignment.weight > 100) {
      alert(
        `Total weight exceeds 100%. Current total weight: ${totalWeight}%.`
      );
      return;
    }

    setCourses((prevCourses) =>
      prevCourses.map((course) => {
        if (course.id === courseId) {
          return {
            ...course,
            assignments: [...course.assignments, { ...assignment }],
          };
        }
        return course;
      })
    );

    // Reset the new assignment fields for the course
    setNewAssignments((prev) => ({
      ...prev,
      [courseId]: { name: "", weight: 0, score: 0 },
    }));
  };

  // Update new assignment fields
  const updateNewAssignment = (courseId, field, value) => {
    setNewAssignments((prev) => ({
      ...prev,
      [courseId]: { ...prev[courseId], [field]: value },
    }));
  };

  // Helper function to calculate current grade for a course
  const calculateCurrentGrade = (course) => {
    const totalWeight = course.assignments.reduce(
      (sum, a) => sum + a.weight,
      0
    );
    const weightedSum = course.assignments.reduce(
      (sum, a) => sum + (a.score * a.weight) / 100,
      0
    );
    return totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 0;
  };

  // Predict final grade based on target
  const predictFinalGrade = (course) => {
    const completedWeight = course.assignments.reduce(
      (sum, a) => sum + a.weight,
      0
    );
    const remainingWeight = 100 - completedWeight;
    const currentGrade = calculateCurrentGrade(course);
    const currentWeightedGrade = currentGrade * (completedWeight / 100);
    const targetWeightedGrade = course.targetGrade * (remainingWeight / 100);
    return (currentWeightedGrade + targetWeightedGrade).toFixed(2);
  };

  // Calculate required score on remaining assignments to achieve target
  const calculateRequiredScore = (course) => {
    const completedWeight = course.assignments.reduce(
      (sum, a) => sum + a.weight,
      0
    );
    const currentPoints = course.assignments.reduce(
      (sum, a) => sum + a.score * a.weight,
      0
    );
    const targetPoints = course.targetGrade * 100;
    const remainingWeight = 100 - completedWeight;

    if (remainingWeight <= 0) return "N/A";

    const requiredScore = (targetPoints - currentPoints) / remainingWeight;
    if (requiredScore > 100) return "Impossible";
    if (requiredScore < 0) return "Already Achieved";
    return `${requiredScore.toFixed(2)}%`;
  };

  // Get letter grade based on percentage
  const getLetterGrade = (percentage) => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  // Get GPA points based on letter grade
  const getGPAPoints = (letterGrade) => {
    switch (letterGrade) {
      case "A":
        return 4.0;
      case "B":
        return 3.0;
      case "C":
        return 2.0;
      case "D":
        return 1.0;
      default:
        return 0.0;
    }
  };

  // Calculate overall GPA
  const calculateGPA = () => {
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    const totalPoints = courses.reduce((sum, course) => {
      const currentGrade = calculateCurrentGrade(course);
      const letterGrade = getLetterGrade(currentGrade);
      return sum + getGPAPoints(letterGrade) * course.credits;
    }, 0);
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "N/A";
  };

  // Determine study priorities based on grade gaps
  const getStudyPriorities = () => {
    return courses
      .map((course) => ({
        name: course.name,
        gap: course.targetGrade - calculateCurrentGrade(course),
      }))
      .sort((a, b) => b.gap - a.gap)
      .slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 space-y-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">US Academic Grade Calculator</h1>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="bg-white shadow-md rounded-lg">
          <AccordionItem value="faq">
            <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-gray-700 hover:bg-gray-50">How to Use / FAQ</AccordionTrigger>
            <AccordionContent className="px-6 py-4 bg-gray-50">
              <div className="space-y-4 text-gray-600">
                <h3 className="text-lg font-semibold text-gray-700">Key Terms:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Course Credits:</strong> Represent the academic workload of a course. Can be any positive number, including decimals.
                  </li>
                  <li>
                    <strong>Assignment Weight:</strong> The percentage of the total course grade an assignment is worth.
                  </li>
                  <li>
                    <strong>Score:</strong> Your grade on a specific assignment, usually as a percentage.
                  </li>
                  <li>
                    <strong>Current Grade:</strong> Your overall grade in the course based on completed assignments.
                  </li>
                  <li>
                    <strong>Target Grade:</strong> The final grade you're aiming to achieve in the course.
                  </li>
                  <li>
                    <strong>GPA (Grade Point Average):</strong> A numerical representation of your average performance across all courses.
                  </li>
                </ul>
                <h3 className="text-lg font-semibold text-gray-700">How to Use:</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Add your courses with their names and credit hours.</li>
                  <li>For each course, add assignments with their weights and your scores.</li>
                  <li>Set target grades for each course.</li>
                  <li>Use the grade predictions and study priorities to plan your efforts.</li>
                  <li>Update your scores as you complete more assignments.</li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Add New Course Card */}
        <Card className="bg-white shadow-md">
          <CardHeader className="bg-blue-600">
            <CardTitle className="text-xl font-semibold text-white">Add New Course</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div>
              <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-1">
                Course Name
              </label>
              <Input
                id="courseName"
                placeholder="e.g. Introduction to Computer Science"
                value={newCourse.name}
                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="courseCredits" className="block text-sm font-medium text-gray-700 mb-1">
                Course Credits
                <span className="text-xs text-gray-500 ml-1">(Any positive number, including decimals)</span>
              </label>
              <Input
                id="courseCredits"
                type="number"
                step="0.1"
                min="0.1"
                placeholder="e.g. 3"
                value={newCourse.credits}
                onChange={(e) => setNewCourse({ ...newCourse, credits: e.target.value })}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <Button
              onClick={addCourse}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!newCourse.name.trim() || !newCourse.credits}
            >
              Add Course
            </Button>
          </CardContent>
        </Card>

        {/* List of Courses */}
        {courses.map((course) => (
          <Card key={course.id} className="bg-white shadow-md">
            <CardHeader className="bg-gray-100">
              <CardTitle className="text-xl font-semibold text-gray-800">
                {course.name} ({course.credits} credits)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Current and Target Grades */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-700">
                    Current Grade: <span className="text-blue-600 font-semibold">{calculateCurrentGrade(course).toFixed(2)}%</span> ({getLetterGrade(calculateCurrentGrade(course))})
                  </span>
                  <span className="text-lg font-medium text-gray-700">
                    Target Grade: <span className="text-green-600 font-semibold">{course.targetGrade}%</span>
                  </span>
                </div>
                <Progress value={calculateCurrentGrade(course)} max={100} className="h-2 bg-gray-200" />

                {/* Assignments Table */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">Assignments</h4>
                  {course.assignments.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-gray-600">Name</TableHead>
                          <TableHead className="text-gray-600">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>Weight (%)</TooltipTrigger>
                                <TooltipContent>
                                  <p>Percentage of total course grade</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableHead>
                          <TableHead className="text-gray-600">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>Score (%)</TooltipTrigger>
                                <TooltipContent>
                                  <p>Your grade on this assignment</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {course.assignments.map((assignment, index) => (
                          <TableRow key={index}>
                            <TableCell>{assignment.name}</TableCell>
                            <TableCell>{assignment.weight}</TableCell>
                            <TableCell>{assignment.score}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-sm text-gray-500">No assignments added yet.</p>
                  )}
                </div>

                {/* Add New Assignment */}
                <div className="flex flex-wrap gap-2">
                  <Input
                    placeholder="Assignment Name"
                    value={newAssignments[course.id]?.name || ""}
                    onChange={(e) => updateNewAssignment(course.id, "name", e.target.value)}
                    className="flex-1 min-w-[150px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="Weight (%)"
                    value={newAssignments[course.id]?.weight || ""}
                    onChange={(e) =>
                      updateNewAssignment(course.id, "weight", parseFloat(e.target.value) || 0)
                    }
                    className="w-24 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Score (%)"
                    value={newAssignments[course.id]?.score || ""}
                    onChange={(e) =>
                      updateNewAssignment(course.id, "score", parseFloat(e.target.value) || 0)
                    }
                    className="w-24 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button
                    onClick={() => addAssignment(course.id)}
                    disabled={!newAssignments[course.id]?.name.trim()}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    Add
                  </Button>
                </div>

                {/* Grade Prediction */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">Grade Prediction</h4>
                  <p className="text-gray-600">
                    Predicted Final Grade:{" "}
                    <span className="font-semibold text-blue-600">{predictFinalGrade(course)}%</span> ({getLetterGrade(calculateCurrentGrade(course))})
                  </p>
                  <p className="text-gray-600">
                    Required Score on Remaining Assignments:{" "}
                    <span className="font-semibold text-green-600">{calculateRequiredScore(course)}</span>
                  </p>
                </div>

                {/* Adjust Target Grade */}
                <div>
                  <label
                    htmlFor={`targetGrade-${course.id}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Adjust Target Grade
                  </label>
                  <Slider
                    id={`targetGrade-${course.id}`}
                    min={0}
                    max={100}
                    step={1}
                    value={[course.targetGrade]}
                    onValueChange={(value) => {
                      const updatedCourses = courses.map((c) =>
                        c.id === course.id ? { ...c, targetGrade: value[0] } : c
                      );
                      setCourses(updatedCourses);
                    }}
                    className="py-4"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* GPA Calculator Card */}
        <Card className="bg-white shadow-md">
          <CardHeader className="bg-blue-600">
            <CardTitle className="text-xl font-semibold text-white">GPA Calculator</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-2xl font-bold text-gray-800 mb-2">Current GPA: <span className="text-blue-600">{calculateGPA()}</span></p>
            <p className="text-sm text-gray-600">
              GPA is calculated based on your current grades in all courses using the US 4.0 scale.
            </p>
          </CardContent>
        </Card>

        {/* Study Priorities Card */}
        <Card className="bg-white shadow-md">
          <CardHeader className="bg-green-600">
            <CardTitle className="text-xl font-semibold text-white">Study Priorities</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {getStudyPriorities().length > 0 ? (
              <ul className="list-disc pl-5 space-y-2">
                {getStudyPriorities().map((priority, index) => (
                  <li key={index} className="text-gray-700">
                    <span className="font-semibold">{priority.name}:</span> Improve by <span className="text-green-600 font-semibold">{priority.gap.toFixed(2)}%</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No study priorities identified.</p>
            )}
            <p className="text-sm text-gray-500 mt-4">
              Priorities are based on the gap between current and target grades.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GradeCalculator;