import { notEqual } from 'assert';
import { read, readFile } from 'fs';
import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, Vault, moment, TFile, TAbstractFile, TFolder} from 'obsidian';
var pdfjs=require("pdfjs")
//callback: most general
//checkCallback: callback with condition
//editorCallback: access the text
//editorCheckCallback: editorCallback condition
export default class MyPlugin extends Plugin {

	onload() {
		this.addCommand({ 
			id: "move-variable-declarations-up",
			name: "Clean code for Mermaid.js ( [ graph | flowchart ] )",
			editorCallback: (editor:Editor, view:MarkdownView) => {
				let  selection_old = editor.getSelection() //.getDoc().getValue() per l'intero documento
				let  check_graph_type=['graph', 'flowchart']

				let  top_lines= selection_old.split('\n').filter(d=>{if(d!=='') return d}).slice(0,2)
				if (top_lines[0].trim()!=='```mermaid' && !top_lines[1].trim().match(/[graph flowchart]/g)) return

				
				let  selection_copy = JSON.parse(JSON.stringify(selection_old))
								let  parenthesis_pattern = /[\(\[\>]/g
				let  parenthesis_pattern_open = /[\(\[\>]/

				let  parenthesis_pattern_close= /[\)\]]/

				let  re_variables_pattern =    /([\w\d\_\/]+[\(\[\>][^\)\]\<]+[\)\]]?[^&\.\n\s][\"\']?[^&\n\-]*[\)\]\<])/g // PROBLEMA CON PARENTESI CHIUSE NESTATE i.e. chiude
				let  re_variables= selection_old.match(re_variables_pattern)
				
				let  re_variables_quotes= selection_old.match(re_variables_pattern)?.
				map(d=>d.split(parenthesis_pattern_open)[0]+ d[parenthesis_pattern_open.exec(d)!.index] +'"'+d.split(parenthesis_pattern_open).slice(1,).join('')).
				map(d=>d.slice(0,-1) + '"' +d.slice(-1)).map(d=>d.replace('""','"'))


		
				
				let  clean_variables=re_variables?.map((d,i)=>{
					let  short_name = d.split( parenthesis_pattern )[0]
				
					selection_copy= selection_copy.replace(d, short_name)

					return '    '+d
				})

				let  vars_formatted=re_variables_quotes?.join('\n')

				let  final_code = selection_copy.split('\n').slice(0,2).join(' \n') +'\n\n\n%%var space start' + vars_formatted + '\n%%var space end\n\n\n' + selection_copy.split('\n').slice(2,).join('\n')

				//final_code = final_code.replace(/\&/g, ' & ')
				//clean eventual errors in vars
				if(final_code.match(/\%\%var space start/g)!.length > 1){
					let  temp =final_code.split('%%var space end').splice(0,1)
					let  temp2= final_code.split('%%var space end').splice(2,)
					final_code = temp + '\n%%var space end' + temp2
				}

				let  final_code_ = top_lines.join('\n') + '\n' + '\n%%var space start\n' + final_code.split('%%var space start')[1].replace(top_lines[1],'')
				final_code_ = final_code_.replace('\n\n\n\n\n','')
												
				editor.replaceSelection(final_code_)
			}
		})

		this.addCommand({
			id:'regex-for-mermaid-style',
			name:'Regex for Mermaid.js style ( [ style | class ] )',
			editorCallback: async(editor: Editor, view: MarkdownView) =>{
				//TO DO: check if first line is "```mermaid" and second line starts with "graph" or "flowchart"

				//get document text
				let  document = this.app.workspace.getActiveFile()
				if  (!document?.name) return;
				let  document_txt = await this.app.vault.read(document)
				//get selection
				let  selection = editor.getSelection().split('\n')[0].split(" ")

				
				let  style_type  = selection.slice(0,1)
				let  style_val = selection.slice(-1)
				let  style_regex = selection.slice(1,2)

				
												
				//re patterns
				let  all_vars_raw=document_txt.match(/([\w\d\_\/]+[\(\[\>][^\)\]\<]+[\)\]]?[^&\.\n\s][\"\']?[^&\n\-]*[\)\]\<])/g)
				let  parenthesis_pattern = /[\(\[\>]/g
				//extract variables from doc text
				let  all_vars_clean= all_vars_raw?.map(d=>d.split(parenthesis_pattern)[0] )
				
				//apply custom regex
				let  regex_code =String(style_regex).split(',')[0].replace('/','').replace('/','') 
								let  custom_regex= new RegExp(String(regex_code), 'g')

				let  retrieved_vars = all_vars_clean?.filter(d=>{
					if(d.match(custom_regex)){
						return d
					} 
				})
								if (editor.getSelection().split('\n')[0].split(' ')[0]==='style'){
					let  retrieved_vars_formatted  = retrieved_vars!.map(re=>{
						return [style_type, re, style_val].join(' ')
					})
					editor.replaceSelection(retrieved_vars_formatted.join('\n'))

				} else if(editor.getSelection().split('\n')[0].split(' ')[0]==='class'){
					let  retrieved_vars_formatted_class = [style_type , retrieved_vars?.join(','), style_val].join(' ')
					editor.replaceSelection(retrieved_vars_formatted_class)
				}

			}
		})

		this.addCommand({
			id: 'create-empty-files-from-list-of-titles',
			name: 'Create empty files from a list of titles' ,
			editorCallback : (editor :Editor, view: MarkdownView)=>{
				const basePath = (this.app.vault.adapter as any).basePath
				let  activeFolder = this.app.workspace.getActiveFile()?.parent.path
				
				let  selection= editor.getSelection()
				let  file_names= selection.split('\n').filter(d=>{
					if (d!==''){
						return d.trim()
					}
				})

				let path= this.app.workspace.getActiveFile()?.parent.path
				let folder= this.app.vault.getAbstractFileByPath(path!)!.parent			
				let files =new Array()
				Vault.recurseChildren(folder, (file:TFile)=>{
					files.push(file.path)
				})
				file_names.map(d=>{
					if(!(files.includes(activeFolder! + `/${d}.md` ))){
					this.app.vault.create(activeFolder! + `/${d}.md`,'')
					}
					// else file already exists

				})
			}
		})


	}

	onunload() {

	}

}
