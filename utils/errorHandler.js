const registerStudent = async (req, res) => {
    const { name, email, password, graduationYear, department } = req.body;
  
    try {
      const student = await Student.create({ name, email, password, graduationYear, department });
      const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(201).send({ token, student });
    } catch (error) {
      // Check for validation errors
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map((err) => err.message);
        return res.status(400).send({ message: 'Validation error', errors });
      }
      res.status(500).send({ message: 'Error creating student', error });
    }
  };
  