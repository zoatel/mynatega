
const GenerateChatResponse = async (resData, subjectsData, settings, maxGrades) => {
  const API_KEY = settings.api
  const systemMessage = {
    role: 'system',
    content: 'Please provide a concise and very mean humorous joke about the outcome you receive also incorporating the student\'s first name only in English.',
  };
  let chatResponse = ''

  try {
    const fetchData = async () => {

      const subjectNumbers = Array.from({ length: settings.firstTermQ + settings.secondTermQ }, (_, index) => index + 1)
      const subjectGrades = subjectNumbers.map((subjectNum) => `${resData['Subject_' + subjectNum]}`).join(', ')
      const subjectsNames = subjectNumbers.map((subjectNum) => `${subjectsData['Subject_' + subjectNum]}`).join(', ')

      const prompt = `Student Name: ${resData.STNa}\nSubject Grades: ${subjectGrades}\nMax Subjects Grades: ${maxGrades.join(', ')}\nSubjects Names: ${subjectsNames}\nFull Score: ${resData.fullGrade}\nMax Full Score: ${settings.totalMax}\n`

      const nextMessage = {
        role: 'user',
        content: prompt,
      }
      const apiRequestBody = {
        model: "gpt-3.5-turbo",
        messages: [systemMessage, nextMessage],
      }


      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiRequestBody),
        }
      )

      const data = await response.json()
      chatResponse = data?.choices?.[0]?.message?.content


    }

    await fetchData()
  } catch (error) {
    //console.error("Error generating chat response:", error)
  }

  return chatResponse
}

export default GenerateChatResponse
