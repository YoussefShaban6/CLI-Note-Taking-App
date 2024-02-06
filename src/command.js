import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import {
  findNotes,
  getAllNotes,
  newNote,
  removeAllNotes,
  removeNote,
} from './notes.js';
import { start } from './server.js';

const listNotes = (notes) => {
  notes.forEach(({ id, content, tags }) => {
    console.log('id: ', id);
    console.log('tags: ', tags);
    console.log('content: ', content);
    console.log('\n');
  });
};

yargs(hideBin(process.argv))
  .command(
    'new <note>',
    'create a new note',
    (yargs) => {
      return yargs.positional('note', {
        describe: 'The content of the note you want to create',
        type: 'string',
      });
    },
    async (argv) => {
      const tags = argv.tags ? argv.tags.split(',') : [];
      const note = await newNote(argv.note, tags);
      console.log('New note! ', note);
    },
  )
  .option('tags', {
    alias: 't',
    type: 'string',
    description: 'tags to add to the note',
  })
  .command(
    'all',
    'get all notes',
    () => {},
    async (argv) => {
      const notes = await getAllNotes();
      notes.length > 0
        ? listNotes(notes)
        : console.log('There is no note yet!');
    },
  )
  .command(
    'find <filter>',
    'get matching notes',
    (yargs) => {
      return yargs.positional('filter', {
        describe:
          'The search term to filter notes by, will be applied to note.content',
        type: 'string',
      });
    },
    async (argv) => {
      const note = await findNotes(argv.filter);
      console.log(note);
    },
  )
  .command(
    'remove <id>',
    'remove a note by id',
    (yargs) => {
      return yargs.positional('id', {
        type: 'number',
        description: 'The id of the note you want to remove',
      });
    },
    async (argv) => {
      const note = await removeNote(argv.id);
      console.log(note);
    },
  )
  .command(
    'web [port]',
    'launch website to see notes',
    (yargs) => {
      return yargs.positional('port', {
        describe: 'port to bind on',
        default: 5000,
        type: 'number',
      });
    },
    async (argv) => {
      const notes = await getAllNotes();
      start(notes, argv.port);
    },
  )
  .command(
    'clean',
    'remove all notes',
    () => {},
    async (argv) => {
      await removeAllNotes();
      console.log('DB reseted');
    },
  )
  .demandCommand(1)
  .parse();
