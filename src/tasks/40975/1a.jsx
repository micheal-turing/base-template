import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
  Button, Input, Label, Slider, Table, TableBody, TableCell, TableHeader, TableRow,
  Progress, Tooltip
} from "@/components/ui";

function App() {
  const [courses, setCourses] = useState([]);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCredits, setNewCourseCredits] = useState(1);

  const addCourse = () => {
    if (newCourseName && newCourseCredits > 0) {
      setCourses([...courses, {
        name: newCourseName, 
        credits: parseFloat(newCourseCredits), 
        assignments: [], 
        targetGrade: 90
      }]);
      setNewCourseName('');
      setNewCourseCredits(1);
    }
  };

  const addAssignment = (courseIndex, name, weight, score) => {
    if (weight > 0 && score >= 0 && score <= 100) {
      const updatedCourses = [...courses];
      updatedCourses[courseIndex].assignments.push({name, weight: parseFloat(weight), score: parseFloat(score)});
      setCourses(updatedCourses);
    }
  };

  const calculateCourseGrade = (assignments) => {
    const totalWeight = assignments.reduce((sum, a) => sum + a.weight, 0);
    if (totalWeight === 0) return 0;
    const grade = assignments.reduce((sum, a) => sum + (a.score * a.weight / totalWeight), 0);
    return grade;
  };

  const calculateGPA = () => {
    const totalPoints = courses.reduce((sum, course) => sum + (course.grade * course.credits), 0);
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    return totalCredits ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  const letterGrade = (grade) => {
    if (grade >= 90) return 'A';
    if (grade >= 80) return 'B';
    if (grade >= 70) return 'C';
    if (grade >= 60) return 'D';
    return 'F';
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">US Academic Grade Calculator</h1>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Add New Course</CardTitle>
          </CardHeader>
          <CardContent>
            <Input 
              value={newCourseName} 
              onChange={(e) => setNewCourseName(e.target.value)} 
              placeholder="Course Name" 
              className="mb-2"
            />
            <Input 
              type="number" 
              value={newCourseCredits} 
              onChange={(e) => setNewCourseCredits(e.target.value)} 
              placeholder="Credits" 
              className="mb-2"
              min="0.1" 
              step="0.1"
            />
            <Button onClick={addCourse}>Add Course</Button>
          </CardContent>
        </Card>

        {courses.map((course, index) => (
          <CourseCard 
            key={index} 
            course={course} 
            index={index} 
            addAssignment={addAssignment} 
            calculateGrade={calculateCourseGrade}
          />
        ))}

        <GPAAndPriorityCard courses={courses} calculateGPA={calculateGPA} />

        <Accordion type="single" collapsible>
          <AccordionItem value="faq">
            <AccordionTrigger>How to Use / FAQ</AccordionTrigger>
            <AccordionContent>
              {/* FAQ content */}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

function CourseCard({ course, index, addAssignment, calculateGrade }) {
  const [assignmentName, setAssignmentName] = useState('');
  const [assignmentWeight, setAssignmentWeight] = useState(1);
  const [assignmentScore, setAssignmentScore] = useState(0);

  const grade = calculateGrade(course.assignments);
  const requiredScore = (course.targetGrade - grade * (1 - (assignmentWeight / 100))) / (assignmentWeight / 100);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{course.name}</CardTitle>
        <CardDescription>Credits: {course.credits}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-2">
          <span className="mr-2">Current Grade:</span>
          <Progress value={grade} className="flex-grow" />
          <span>{grade.toFixed(2)}% ({letterGrade(grade)})</span>
        </div>
        <div className="mb-2">
          <Label>Target Grade:</Label>
          <Slider 
            defaultValue={[course.targetGrade]} 
            onValueChange={(value) => {
              const updatedCourses = [...courses];
              updatedCourses[index].targetGrade = value[0];
              setCourses(updatedCourses);
            }}
            max={100}
            step={1}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Weight</TableCell>
              <TableCell>Score</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {course.assignments.map((assignment, aIndex) => (
              <TableRow key={aIndex}>
                <TableCell>{assignment.name}</TableCell>
                <TableCell>{assignment.weight}%</TableCell>
                <TableCell>{assignment.score}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-2">
          <Input 
            value={assignmentName} 
            onChange={(e) => setAssignmentName(e.target.value)} 
            placeholder="Assignment Name" 
            className="mb-2"
          />
          <Input 
            type="number" 
            value={assignmentWeight} 
            onChange={(e) => setAssignmentWeight(e.target.value)} 
            placeholder="Weight (%)" 
            className="mb-2"
            min="1" 
          />
          <Input 
            type="number" 
            value={assignmentScore} 
            onChange={(e) => setAssignmentScore(e.target.value)} 
            placeholder="Score (%)" 
            className="mb-2"
            min="0" 
            max="100"
          />
          <Button onClick={() => addAssignment(index, assignmentName, assignmentWeight, assignmentScore)}>Add Assignment</Button>
          {assignmentWeight > 0 && <p>Required score for next assignment to reach target: {requiredScore.toFixed(2)}%</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function GPAAndPriorityCard({ courses, calculateGPA }) {
  const gpa = calculateGPA();
  const priorities = courses
    .map(course => ({
      ...course, 
      gap: course.targetGrade - calculateCourseGrade(course.assignments)
    }))
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 3);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>GPA & Study Priorities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Label>Current GPA:</Label>
          <p>{gpa}</p>
        </div>
        <Label>Top Priorities:</Label>
        {priorities.map((course, idx) => (
          <p key={idx}>{idx + 1}. {course.name} - Gap: {course.gap.toFixed(2)}%</p>
        ))}
      </CardContent>
    </Card>
  );
}

export default App;