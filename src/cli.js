import { loadConfig, SUPPORTED_WORKFLOWS } from './config.js';
import { formatJson, formatText } from './format.js';
import { runWorkflow } from './run.js';
import { pathToFileURL } from 'node:url';

function parseArgs(argv) {
  const [command, workflow, ...rest] = argv;
  const options = {
    command,
    workflow,
    dryRun: false,
    format: 'text',
    outputDir: undefined,
    configPath: undefined
  };

  for (let i = 0; i < rest.length; i += 1) {
    const token = rest[i];
    if (token === '--dry-run') {
      options.dryRun = true;
      continue;
    }
    if (token === '--config') {
      options.configPath = rest[i + 1];
      i += 1;
      continue;
    }
    if (token === '--output') {
      options.outputDir = rest[i + 1];
      i += 1;
      continue;
    }
    if (token === '--format') {
      options.format = rest[i + 1] ?? 'text';
      i += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${token}`);
  }

  return options;
}

export async function main(argv = process.argv.slice(2)) {
  try {
    const options = parseArgs(argv);

    if (options.command !== 'run') {
      throw new Error('Usage: browser-agent-starter run <workflow> --config <file> [--output <dir>] [--dry-run] [--format text|json]');
    }

    if (!SUPPORTED_WORKFLOWS.has(options.workflow)) {
      throw new Error(`Unknown workflow: ${options.workflow ?? 'missing'}`);
    }

    if (!options.configPath) {
      throw new Error('Missing required --config <file>');
    }

    if (!['text', 'json'].includes(options.format)) {
      throw new Error(`Unknown format: ${options.format}`);
    }

    const config = await loadConfig(options.configPath, {
      workflow: options.workflow,
      dryRun: options.dryRun,
      outputDir: options.outputDir
    });

    const result = await runWorkflow(config);
    const output = options.format === 'json' ? formatJson(result) : formatText(result);
    process.stdout.write(output + '\n');
    return 0;
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
    return 1;
  }
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const exitCode = await main(process.argv.slice(2));
  process.exitCode = exitCode;
}
