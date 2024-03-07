const express = require('express');
const axios = require('axios');

const app = express();
const port = 4002;

app.get('/:formId/filteredResponses', async (req, res) => {
  const formId = req.params.formId;
  const filters = req.query.filters;

  try {
    const responses = await axios.get(
      `https://api.fillout.com/v1/api/forms/${formId}/submissions`,
      {headers: {
          'Authorization': 'Bearer sk_prod_TfMbARhdgues5AuIosvvdAC9WsA5kXiZlW8HZPaRDlIbCpSpLsXBeZO7dCVZQwHAY3P4VSBPiiC33poZ1tdUj2ljOzdTCCOSpUZ_3912',
          'Content-Type': 'application/json'
        },
        params: req.query
      }
    );

    if (filters) {
      const filterClauses = JSON.parse(filters);
      console.log(responses,'25', filterClauses)
      responses.data.responses = responses.data.responses.filter(response => {
        return filterClauses.every(clause => {
          const responseValue = response.questions.find(q => q.id === clause.id)?.value;
          if (!responseValue) return false;

          switch (clause.condition) {
            case 'equals':
              return responseValue === clause.value;
            case 'does_not_equal':
              return responseValue !== clause.value;
            case 'greater_than':
              if (typeof clause.value === 'string') {
                const date = new Date(clause.value);
                return new Date(responseValue) > date;
              }
              return Number(responseValue) > Number(clause.value);
            case 'less_than':
              if (typeof clause.value === 'string') {
                const date = new Date(clause.value);
                return new Date(responseValue) < date;
              }
              return Number(responseValue) < Number(clause.value);
            default:
              throw new Error(`Invalid condition: ${clause.condition}`);
          }
        });
      });
    }

    res.json(responses.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching responses' });
  }
});

app.get('/', (req,res)=>{
  res.send("yes,working!")
})
app.listen(port, () => {
  console.log(`server listening at ${port}`);
});