// App.jsx
import React, { useState } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, 
  Slider, Button, Input, Accordion, AccordionItem, 
  Tooltip 
} from "@/components/ui";
import { PlusIcon, InfoOutlineIcon } from "@radix-ui/react-icons";

const App = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ name: '', credits: '' });

  const addCourse = () => {
    if (newCourse.name && newCourse.credits > 0) {
      setCourses([...courses, { ...newCourse, assignments: [], currentGrade: 0, targetGrade: 90 }]);
      setNewCourse({ name: '', credits: '' });
    }
  };

  const calculateGPA = () => {
    let totalCredits = 0;
    let gradePoints = 0;
    courses.forEach(course => {
      totalCredits += parseFloat(course.credits);
      let grade = course.currentGrade;
      let points = grade >= 90 ? 4 : grade >= 80 ? 3 : grade >= 70 ? 2 : grade >= 60 ? 1 : 0;
      gradePoints += points * parseFloat(course.credits);
    });
    return (gradePoints / totalCredits).toFixed(2) || 0;
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-center text-2xl">US Academic Grade Calculator</CardTitle>
          </CardHeader>
        </Card>

        {/* Course Management */}
        <Card className="mb-4">
          <CardContent>
            <Input 
              value={newCourse.name} 
              onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
              placeholder="Course Name" 
            />
            <Input 
              type="number" 
              value={newCourse.credits} 
              onChange={(e) => setNewCourse({...newCourse, credits: e.target.value})}
              placeholder="Credits" 
              className="mt-2"
            />
            <Button onClick={addCourse} className="mt-2"><PlusIcon /> Add Course</Button>
          </CardContent>
        </Card>

        {/* Courses Display */}
        {courses.map((course, idx) => (
          <Card key={idx} className="mb-4">
            <CardHeader>
              <CardTitle>{course.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Here you would expand with assignment inputs, grade calculations, etc. */}
              <Slider defaultValue={[course.targetGrade]} max={100} className="my-2" />
              <p>Current Grade: {course.currentGrade}%</p>
            </CardContent>
          </Card>
        ))}

        {/* GPA Card */}
        <Card>
          <CardHeader>
            <CardTitle>GPA</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{calculateGPA()}</p>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Accordion type="single" collapsible>
          <AccordionItem value="faq">
            <AccordionItem.Header>
              How to Use / FAQ
            </AccordionItem.Header>
            <AccordionItem.Panel>
              {/* FAQ content here */}
            </AccordionItem.Panel>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default App;