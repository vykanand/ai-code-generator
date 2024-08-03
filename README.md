# ai-code-generator
AI Code Generator and file create and modify files automatically based on responses from codegpt using nodejs code
It communicates with gemini AI and creates files accordingly

clone and just run
``` 
node generate-prompt.js
```

and give your requirements it will generate all files in chatoutput.txt file.

Once you are happy with the final out just run this command to create these files in the output folder.
```
node writefile.js chatoutput.txt
```

where chatoutput.txt is the file where our AI model generated its output.
