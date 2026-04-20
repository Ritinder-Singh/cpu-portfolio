import { test, expect, Page } from '@playwright/test';

// ─── helpers ────────────────────────────────────────────────────────────────

async function openTerminal({ page }: { page: Page }) {
  await page.goto('/');
  // Double-click the Terminal desktop icon
  await page.locator('text=Terminal').first().dblclick();
  // Wait until the terminal input is ready
  await page.waitForSelector('input[autocomplete="off"]', { timeout: 10_000 });
  // Give the greeting animation time to settle
  await page.waitForTimeout(700);
}

/** Type a command and press Enter, then wait briefly for output to render. */
async function run(page: Page, cmd: string) {
  const input = page.locator('input[autocomplete="off"]');
  await input.click();
  await input.fill(cmd);
  await input.press('Enter');
  await page.waitForTimeout(400);
}

/** Returns the current value of the terminal input (used for tab-completion checks). */
async function inputValue(page: Page): Promise<string> {
  return page.locator('input[autocomplete="off"]').inputValue();
}

// ─── tests ───────────────────────────────────────────────────────────────────

test.describe('Utility commands removed', () => {
  test.beforeEach(openTerminal);

  const removed = ['echo', 'ping', 'weather', 'neofetch'];

  for (const cmd of removed) {
    test(`"${cmd}" is no longer available`, async ({ page }) => {
      await run(page, cmd);
      await expect(page.getByText(`Command not found: ${cmd}`)).toBeVisible();
    });
  }
});

test.describe('Fun commands removed', () => {
  test.beforeEach(openTerminal);

  const removed = ['joke', 'quote', 'fortune', 'coffee', 'ascii', 'banner', 'hack', 'matrix', 'snake', 'iam', 'sudo', 'exit'];

  for (const cmd of removed) {
    test(`"${cmd}" is no longer available`, async ({ page }) => {
      await run(page, cmd);
      await expect(page.getByText(`Command not found: ${cmd}`)).toBeVisible();
    });
  }
});

test.describe('Essential terminal commands still work', () => {
  test.beforeEach(openTerminal);

  test('clear empties the terminal', async ({ page }) => {
    await run(page, 'whoami');
    // The input echo line is visible before clear
    await expect(page.getByText(/ritinder@portfolio:~\$ whoami/)).toBeVisible();
    await run(page, 'clear');
    // After clear, the previous echo line should be gone
    await expect(page.getByText(/ritinder@portfolio:~\$ whoami/)).not.toBeVisible();
  });

  test('history shows past commands', async ({ page }) => {
    await run(page, 'whoami');
    await run(page, 'history');
    // history output lists "whoami" with an index number
    await expect(page.getByText(/1.*whoami/)).toBeVisible();
  });

  test('theme lists available themes when called with no args', async ({ page }) => {
    await run(page, 'theme');
    await expect(page.getByText('dracula')).toBeVisible();
  });

  test('theme switches theme', async ({ page }) => {
    await run(page, 'theme nord');
    await expect(page.getByText('Theme switched to')).toBeVisible();
  });

  test('date returns a date string', async ({ page }) => {
    await run(page, 'date');
    // e.g. "Sun Apr 20 2026"
    await expect(page.getByText(/\d{4}/)).toBeVisible();
  });

  test('time returns a time string', async ({ page }) => {
    await run(page, 'time');
    // e.g. "12:34:56 PM"
    await expect(page.getByText(/\d{1,2}:\d{2}:\d{2}/).first()).toBeVisible();
  });

  test('open with no args lists shortcuts', async ({ page }) => {
    await run(page, 'open');
    await expect(page.getByText(/github/)).toBeVisible();
  });

  test('help shows Portfolio and Filesystem sections', async ({ page }) => {
    await run(page, 'help');
    await expect(page.getByText(/PORTFOLIO/)).toBeVisible();
    await expect(page.getByText(/FILESYSTEM/)).toBeVisible();
  });

  test('help does NOT show Utility or Fun sections', async ({ page }) => {
    await run(page, 'help');
    await expect(page.getByText('UTILITY')).not.toBeVisible();
    await expect(page.getByText('FUN')).not.toBeVisible();
  });
});

test.describe('Filesystem — ls', () => {
  test.beforeEach(openTerminal);

  test('ls at root lists top-level directories', async ({ page }) => {
    await run(page, 'ls');
    // Directories are shown with a trailing slash e.g. "about/  skills/  projects/"
    await expect(page.getByText(/about\/.*skills\/.*projects\//)).toBeVisible();
  });

  test('ls <subdir> lists its contents', async ({ page }) => {
    await run(page, 'ls about');
    await expect(page.getByText('README.md')).toBeVisible();
  });

  test('ls projects shows project files', async ({ page }) => {
    await run(page, 'ls projects');
    await expect(page.getByText(/quickmart-api/)).toBeVisible();
  });

  test('ls on a non-existent path returns an error', async ({ page }) => {
    await run(page, 'ls doesnotexist');
    await expect(page.getByText(/No such file or directory/)).toBeVisible();
  });
});

test.describe('Filesystem — cd + pwd', () => {
  test.beforeEach(openTerminal);

  test('pwd shows current directory', async ({ page }) => {
    await run(page, 'cd about');
    await run(page, 'pwd');
    // pwd output should now show ~/about
    await expect(page.getByText('~/about').first()).toBeVisible();
  });

  test('cd into a directory updates the prompt', async ({ page }) => {
    await run(page, 'cd about');
    // The prompt span should now contain ~/about$
    await expect(page.locator('span').filter({ hasText: /ritinder@portfolio:~\/about\$/ })).toBeVisible();
  });

  test('cd .. navigates back to parent', async ({ page }) => {
    await run(page, 'cd about');
    await run(page, 'cd ..');
    // Prompt should return to ~$
    await expect(page.locator('span').filter({ hasText: /ritinder@portfolio:~\$/ })).toBeVisible();
  });

  test('cd to non-existent directory returns error', async ({ page }) => {
    await run(page, 'cd doesnotexist');
    await expect(page.getByText(/No such file or directory/)).toBeVisible();
  });

  test('cd into a file returns error', async ({ page }) => {
    await run(page, 'cd about/README.md');
    await expect(page.getByText(/Not a directory/)).toBeVisible();
  });
});

test.describe('Filesystem — cat', () => {
  test.beforeEach(openTerminal);

  test('cat with absolute path from root works', async ({ page }) => {
    await run(page, 'cat about/README.md');
    await expect(page.getByText(/Ritinder Singh/)).toBeVisible();
  });

  test('cat with relative path after cd works', async ({ page }) => {
    await run(page, 'cd about');
    await run(page, 'cat README.md');
    await expect(page.getByText(/Ritinder Singh/)).toBeVisible();
  });

  test('cat a file in a sibling directory after cd', async ({ page }) => {
    await run(page, 'cd skills');
    await run(page, 'cat languages.txt');
    // languages.txt content: "Python · Dart · JavaScript · SQL · Bash"
    await expect(page.getByText(/Python · Dart/)).toBeVisible();
  });

  test('cat on a directory returns error', async ({ page }) => {
    await run(page, 'cat about');
    await expect(page.getByText(/Is a directory/)).toBeVisible();
  });

  test('cat on a non-existent file returns error', async ({ page }) => {
    await run(page, 'cat notafile.txt');
    await expect(page.getByText(/No such file or directory/)).toBeVisible();
  });

  test('cat with no argument returns error', async ({ page }) => {
    await run(page, 'cat');
    await expect(page.getByText('cat: missing operand')).toBeVisible();
  });
});

test.describe('Filesystem — tree', () => {
  test.beforeEach(openTerminal);

  test('tree displays directory structure', async ({ page }) => {
    await run(page, 'tree');
    await expect(page.getByText(/about\//)).toBeVisible();
    await expect(page.getByText(/projects\//)).toBeVisible();
    await expect(page.getByText('README.md')).toBeVisible();
  });
});

test.describe('Tab completion', () => {
  test.beforeEach(openTerminal);

  test('tab-completes a command name', async ({ page }) => {
    const input = page.locator('input[autocomplete="off"]');
    await input.click();
    await input.fill('who');
    await input.press('Tab');
    expect(await inputValue(page)).toBe('whoami');
  });

  test('tab-completes a top-level directory for ls', async ({ page }) => {
    const input = page.locator('input[autocomplete="off"]');
    await input.click();
    await input.fill('ls abo');
    await input.press('Tab');
    expect(await inputValue(page)).toBe('ls about/');
  });

  test('tab-completes a filename for cat', async ({ page }) => {
    const input = page.locator('input[autocomplete="off"]');
    await input.click();
    await input.fill('cat about/READ');
    await input.press('Tab');
    expect(await inputValue(page)).toBe('cat about/README.md');
  });

  test('tab-completes a relative filename after cd', async ({ page }) => {
    await run(page, 'cd about');
    const input = page.locator('input[autocomplete="off"]');
    await input.click();
    await input.fill('cat READ');
    await input.press('Tab');
    expect(await inputValue(page)).toBe('cat README.md');
  });

  test('tab-completes directory for cd', async ({ page }) => {
    const input = page.locator('input[autocomplete="off"]');
    await input.click();
    await input.fill('cd pro');
    await input.press('Tab');
    expect(await inputValue(page)).toBe('cd projects/');
  });
});
