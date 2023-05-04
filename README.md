# Mermaid.js-Helper-OMH-plugin
An [Obsidian](https://obsidian.md/) plugin to help with [mermaid.js graph/flowcharts](https://mermaid.js.org/syntax/flowchart.html) plus extra commands.

## Mermaid commands:

- ### \> Clean code for Mermaid.js ( [ graph | flowchart ] ):
  Select ONLY the mermaid.js cell of type graph or flowchart and run the command in order to move variable declarations at the top.
  
  ![](https://github.com/FrancescoDiCursi/Obsidian-Mermaid.js-Helper-OMH-plugin/blob/main/gifs/obsidian%20clean%20text.gif)


- ### \> Regex for Mermaid.js ( [ style | class ] ):
  Select ONLY the mermaid.js style or class row giving a regex pattern as id
  
  (eg. style|class /any-regex-pattern/ fill:#f9f,stroke:#333|className)
  
   ![](https://github.com/FrancescoDiCursi/Obsidian-Mermaid.js-Helper-OMH-plugin/blob/main/gifs/obsidian%20style%20re.gif)

  
# Extra commands:
  
 - ### \> Create empty files from list of titles:
    Select a list of names separated by new line and run the command to create those files in the active folder
      
    ![](https://github.com/FrancescoDiCursi/Obsidian-Mermaid.js-Helper-OMH-plugin/blob/main/gifs/obsidian%20files.gif)
    
- ### \> Create files from sections (H2 as section title)
    Select all sections, each having H2 as title, and run the command to create those files in the active folder
    
    
- ### \> Copy global colorGroups to local graph:
    Set the colorGroups in the global graph view, then open a file and run the command 'Graph view: open local graph'. Finally, in the same active file, run this plugin command and restart Obsidian.


- ### \> List to link:
  Given a list of strings separated by either line break, comma or comma plus line break, it returns a list of links
  
  _e.g.:    a,b,c --> [[a]],[[b]],[[c]]_

