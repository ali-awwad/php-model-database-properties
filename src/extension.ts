import * as vscode from 'vscode';

const connection = require('./helpers/connection');
const helpers = require('./helpers/tools');
import './helpers/string.ext';// has plural prototype

export function activate(context: vscode.ExtensionContext) {

	// on activate run dbconn() to set an instance
	connection.dbconn().then((con: any) => {
		connection.connectionInstance = con;
	}).catch((err: any) => {
		vscode.window.showWarningMessage("Please configure the MySQL connection properly. then restart vsCode.");
		connection.connectionInstance = null;
	});
	const provider2 = vscode.languages.registerCompletionItemProvider(
		{ language: 'php', scheme: 'file' },
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				let linePrefix = document.lineAt(position).text.substr(0, position.character);

				if (linePrefix.includes('$') && linePrefix.endsWith('-')) {
					vscode.workspace.getConfiguration().update('php.suggest.basic', false);
					vscode.workspace.getConfiguration().update('php.validate.enable', false);
					return undefined;
				}
				else {
					vscode.workspace.getConfiguration().update('php.suggest.basic', true);
					vscode.workspace.getConfiguration().update('php.suggest.basic', true)
					return undefined;
				}
			}
		},
		'-' // triggered whenever a '-' is being typed
	);

	const provider3 = vscode.languages.registerCompletionItemProvider(
		{ language: 'php', scheme: 'file' },
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				let linePrefix = document.lineAt(position).text.substr(0, position.character);
				if (linePrefix.includes('$') && linePrefix.endsWith('->')) {
					let selection = helpers.getWordAtPosition(linePrefix, linePrefix.length - 1);
					selection = selection.substring(selection.indexOf('->'), 0).replace('$', '').replace('->', '');
					return new Promise((resolve, reject) => {
						// get table name based on definition; such as $item = new User();
						let tableName = helpers.findVariableDefinition(document, selection, position);

						// START By Table Name
						connection.connectionInstance.query('Show columns from ' + tableName, function (err: any, result: string | any[]) {
							if (err) {
								// START PLURAL if table name not found by finding definition
								connection.connectionInstance.query('Show columns from ' + selection.plural(), function (err: any, result: string | any[]) {
									if (err) {
										reject(false);
									}
									else {
										let suggestions: vscode.CompletionItem[] = [];
										for (var i = 0; i < result.length; i++) {
											let qualifier = (result[i].Null == "NO" && result[i].Default == null) ? "required" : (result[i].Null == "NO" ? result[i].Default : "nullable");
											let cItem = new vscode.CompletionItem(result[i].Field, vscode.CompletionItemKind.Property);
											cItem.detail = result[i].Type;
											// @ts-ignore
											cItem.label2 = { type: result[i].Type, qualifier: qualifier, name: result[i].Field };
											suggestions.push(cItem);
										}
										resolve(suggestions);
									}
								});
								// END PLURAL
							}
							else {
								let suggestions: vscode.CompletionItem[] = [];
								for (var i = 0; i < result.length; i++) {
									let qualifier = (result[i].Null == "NO" && result[i].Default == null) ? "required" : (result[i].Null == "NO" ? result[i].Default : "nullable");
									let cItem = new vscode.CompletionItem(result[i].Field, vscode.CompletionItemKind.Property);
									cItem.detail = result[i].Type;
									// @ts-ignore
									cItem.label2 = { type: result[i].Type, qualifier: qualifier, name: result[i].Field };
									suggestions.push(cItem);
								}
								resolve(suggestions);
							}
						});
						// END By Table Name
					});
				}
				else {
					return undefined;
				}
			}
		},
		'>' // triggered whenever a '>' is being typed
	);
	context.subscriptions.push(provider2, provider3);
}

export function deactivate() { }
