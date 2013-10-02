/*global window: true, document: true, setTimeout: true, XMLHttpRequest: true, localStorage: true */
/*global console: true, alert: true*/
(function (window, document) {
    'use strict';

    var actions = {
            add: function () {
                return document.getElementById('addNote');
            },
            save: function () {
                return document.getElementById('saveNotes');
            },
            load: function () {
                return document.getElementById('loadNotes');
            },
            clear: function () {
                return document.getElementById('clearNotes');
            }
        },
        NoteToSelf = {
            //Number of notes
            count: 0,

            //Notes container
            container: null,

            //Are we currently editing/adding a note?
            editing: false,

            //Return our local storage object
            storage: function () {
                var storage = JSON.parse(localStorage.getItem('NoteToSelf')) || localStorage.setItem('NoteToSelf', JSON.stringify([]));
                return storage;
            },

            //Add a note container to the DOM(if we are able to)
            addNote: function (noteObj) {
                if (this.editing !== true) {
                    var that = this,
                        noteId = this.count,
                        //Create note, paragraph inside of note, and close button
                        note = document.createElement('article'),
                        noteText = document.createElement('p'),
                        noteButtons,
                        close,
                        edit,
                        save,
                        form;

                    //Create save/edit/close buttons unordered list
                    noteButtons = document.createElement('ul');
                    noteButtons.className = 'noteButtons';

                    //Close button
                    close = document.createElement('li');
                    close.className = 'close';
                    close.setAttribute('title', 'Delete Note');
                    close.addEventListener('click', function (e) {
                        that.removeNote(e.target);
                    });

                    //edit button
                    edit = document.createElement('li');
                    edit.className = 'edit';
                    edit.setAttribute('title', 'Edit Note');
                    edit.addEventListener('click', function (e) {
                        if (this.className.match('disabled') === null && that.editing !== true) {
                            that.editing = true;
                            that.editNote(e);
                        }
                    });

                    //Save button
                    save = document.createElement('li');
                    save.className = 'save';
                    save.setAttribute('title', 'Save Changes');
                    save.addEventListener('click', function (e) {
                        if (this.className.match('disabled') === null) {
                            that.editing = false;
                            that.createNote(note);
                        }
                    });

                    //append buttons to container
                    noteButtons.appendChild(save);
                    noteButtons.appendChild(edit);
                    noteButtons.appendChild(close);

                    note.className = 'note';
                    //If this is a new note, add textarea to note article
                    if (typeof noteObj === 'undefined') {
                        this.editing = true;
                        form = document.createElement('textarea');
                        form.setAttribute('id', 'noteText');
                        form.setAttribute('placeholder', 'Begin Typing your note here...');
                        noteText.appendChild(form);
                        edit.className += ' disabled';
                    } else {
                        //If its not a new note, display it regularly
                        noteText.innerHTML = noteObj.note;
                        save.className += ' disabled';
                    }
                    //Set the note id, add the text/textarea and the buttons
                    note.setAttribute('data-id', noteId);
                    note.appendChild(noteText);
                    note.appendChild(noteButtons);

                    //Insert new note and set focus to textarea if applicable
                    this.container.insertBefore(note, this.container.firstChild);
                    if (this.editing === true) {
                        document.getElementById('noteText').focus();
                    }
                    this.count += 1;
                }
            },
            //Edit our note
            editNote: function (e) {
                var edit = e.target,
                    save = e.target.previousSibling,
                    para = e.target.parentNode.previousSibling,
                    form = document.createElement('textarea');

                form.setAttribute('id', 'noteText');
                form.value = para.firstChild.nodeValue;
                para.removeChild(para.firstChild);
                para.appendChild(form);

                //Disable edit button, enable save button, set focus to textarea
                edit.className += ' disabled';
                save.className = 'save';
                form.focus();
            },
            //Add or save note(dependent on circumstance)
            createNote: function (noteNode) {
                var store = this.storage(),
                    noteId = noteNode.getAttribute('data-id'),
                    txt = document.getElementById('noteText'),
                    save = noteNode.childNodes[1].childNodes[0],
                    edit = save.nextSibling,
                    newNote;

                //Textarea empty?
                if (txt.value !== '') {
                    //Create JSON note object
                    newNote = {title: '', date: (new Date()).getTime(), note: txt.value};
                    if (typeof store[noteId] !== 'undefined') {
                        //If this is an edit, change existing note
                        store[noteId] = newNote;
                    } else {
                        //...otherwise, push the new note
                        store.push(newNote);
                    }

                    localStorage.setItem('NoteToSelf', JSON.stringify(store));
                    noteNode.firstChild.innerHTML = newNote.note;

                    save.className += ' disabled';
                    edit.className = 'edit';
                    this.editing = false;
                } else {
                    alert('You can\'t save a blank note, silly!');
                }
            },
            //Remove note from local storage and DOM
            removeNote: function (el) {
                var store = this.storage(),
                    that = this,
                    id = el.parentNode.getAttribute('data-id'),
                    note = el.parentNode.parentNode;
                store.splice(id, 1);
                //CSS animation
                note.style.opacity = 0;
                setTimeout(function () {
                    that.container.removeChild(note);
                }, 400);
                localStorage.setItem('NoteToSelf', JSON.stringify(store));
            },
            //Insert notes into storage and DOM from database
            loadFromDB: function (dbNotes) {
                var notes = JSON.parse(dbNotes),
                    store = this.storage(),
                    i;

                for (i = 0; i < notes.length; i += 1) {
                    //Push note to storage object and add note to DOM
                    store.push(notes[i]);
                    this.addNote(notes[i]);
                }
                localStorage.setItem('NoteToSelf', JSON.stringify(store));
            },
            //Empty the notes from DOM and storage
            clearNotes: function () {
                var i, node;
                this.editing = false;
                this.count = 0;
                for (i = 0; i < this.container.childNodes.length; i += 1) {
                    node = this.container.childNodes[i];
                    if (node.nodeType === 1) {
                        this.container.childNodes[i].style.opacity = 0;
                    }
                }
                setTimeout(function () { NoteToSelf.container.innerHTML = ''; }, 500);
                localStorage.setItem('NoteToSelf', JSON.stringify([]));
            },
            //App setup
            initialize: function () {
                var i,
                    that = this,
                    store = this.storage();
                this.container = document.getElementById('notesContainer');

                for (i = 0; i < store.length; i += 1) {
                    that.addNote(store[i]);
                }

                //Attach methods to our 'action' buttons(add/save/load/clear) to keep inine JS out of our HTML =)
                actions.add().addEventListener('click', function () { that.addNote(); });
                actions.save().addEventListener('click', function () { that.saveDB(); });
                actions.load().addEventListener('click', function () { that.loadDB(); });
                actions.clear().addEventListener('click', function () { that.clearNotes(); });
            },
            //Load notes from database via AJAX
            loadDB: function () {
                var request = new XMLHttpRequest(),
                    loadDlg = document.getElementById('loadInfo');
                //Open request, set header to allow usage of $_POST
                request.open('POST', 'php/user.php');
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                //Animate dialog in
                loadDlg.style.top = '100%';
                loadDlg.style.opacity = '1';
                request.onreadystatechange = function () {
                    if (request.readyState === 4) {
                        var response = JSON.parse(request.responseText);
                        //Did it send us an error?
                        if (response.error) {
                            loadDlg.innerHTML = response.error;
                        } else {
                            //..No? Success! Load 'em!
                            loadDlg.innerHTML = 'Sucessfully loaded your notes!';
                            NoteToSelf.loadFromDB(response);
                        }
                        //Animate dialog bubble
                        setTimeout(function () {
                            loadDlg.style.top = '-500%';
                            loadDlg.style.opacity = '0';
                        }, 2500);
                    }
                };
                //Send 'load' action
                request.send('action=load');
            },
            //Save notes to database using AJAX
            saveDB: function () {
                var request = new XMLHttpRequest(),
                    saveDlg = document.getElementById('saveInfo');
                request.open('POST', 'php/user.php');
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                //Animate save dialog bubble in
                saveDlg.style.top = '100%';
                saveDlg.style.opacity = '1';
                request.onreadystatechange = function () {
                    if (request.readyState === 4) {
                        //Display response message
                        saveDlg.innerHTML = request.responseText;

                        //Animate dialog out
                        setTimeout(function () {
                            saveDlg.style.top = '-500%';
                            saveDlg.style.opacity = '0';
                        }, 2500);
                    }
                };
                //Send 'save' action along with our notes object
                request.send('action=save&notes=' + JSON.stringify(this.storage()));
            }
        };

    window.NoteToSelf = NoteToSelf;

}(window, document));