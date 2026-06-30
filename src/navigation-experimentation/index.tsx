import { useState, useMemo } from 'react'
import { useComputedTheme } from '@instructure/emotion'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { Link } from '@instructure/ui-link/latest'
import { Button, IconButton, CloseButton } from '@instructure/ui-buttons/latest'
import { Avatar } from '@instructure/ui-avatar/latest'
import { Pill } from '@instructure/ui-pill/latest'
import { Checkbox } from '@instructure/ui-checkbox/latest'
import { Alert } from '@instructure/ui-alerts/latest'
import { Table } from '@instructure/ui-table/latest'
import { TextInput } from '@instructure/ui-text-input/latest'
import { NumberInput } from '@instructure/ui-number-input/latest'
import { Spinner } from '@instructure/ui-spinner/latest'
import { SimpleSelect } from '@instructure/ui-simple-select/latest'
import { Tabs } from '@instructure/ui-tabs/latest'
import { SideNavBar } from '@instructure/ui-side-nav-bar/latest'
import { ScreenReaderContent } from '@instructure/ui-a11y-content'
import {
  SettingsInstUIIcon,
  LayoutDashboardInstUIIcon,
  BookOpenInstUIIcon,
  CalendarDaysInstUIIcon,
  InboxInstUIIcon,
  ClockInstUIIcon,
  CircleHelpInstUIIcon,
  SunInstUIIcon,
  MoonInstUIIcon,
  RocketInstUIIcon,
  FolderInstUIIcon,
  TargetInstUIIcon,
  ChartColumnInstUIIcon,
  ClipboardListInstUIIcon,
  ClipboardCheckInstUIIcon,
  PanelLeftInstUIIcon,
  SquarePenInstUIIcon,
  NewspaperInstUIIcon,
  AlignJustifyInstUIIcon,
  PencilInstUIIcon,
  CopyInstUIIcon,
  GripVerticalInstUIIcon,
  Trash2InstUIIcon,
  PlusInstUIIcon,
  SparklesInstUIIcon,
  PaperclipInstUIIcon,
  GaugeInstUIIcon,
  SearchInstUIIcon,
  CircleCheckInstUIIcon,
  CircleSlashInstUIIcon,
  EllipsisVerticalInstUIIcon,
  InfoInstUIIcon,
  ChevronDownInstUIIcon,
  ChevronRightInstUIIcon,
  IconCanvasLogoSolid,
} from '@instructure/ui-icons'
import { Breadcrumb } from '@instructure/ui-breadcrumb/latest'
import type { PrototypeProps } from '../types'
import {
  ITEM_TYPES,
  DEFAULT_POINTS,
  INITIAL_QUESTIONS,
  STUDENTS,
  REPORTS,
  QUIZ_INDEX,
  QUIZ_GROUPS,
  COURSE_NAV,
  ACTIVE_COURSE_NAV,
  QUIZ_TYPE_OPTIONS,
  ASSIGNMENT_GROUP_OPTIONS,
  SCORING_TYPE_OPTIONS,
  QUIZ_SPECIFIC_TOGGLES,
  SCORING_TOGGLES,
  RESTRICT_TOGGLES,
  DISPLAY_TOGGLES,
  RELEASE_FINAL_SCORES,
  RELEASE_RESULTS,
  RELEASE_FEEDBACK,
  SUMMARY_COLUMNS,
  SUMMARY_ASSIGN,
} from './model'
import type { Question, QuestionType, QuizListItem, ToggleItem } from './model'
import { takeQuizHandoff } from './handoff'
import type { HandoffQuestion } from './handoff'

const TABS = ['Summary', 'Build', 'Schedule', 'Moderate', 'Reports']
const QUIZ_TITLE = 'Introduction to Biology — Quiz 1'

let seq = 100
function newId() {
  seq += 1
  return `q${seq}`
}

// Map a Question banks type label onto a builder QuestionType.
const TYPE_MAP: Record<string, QuestionType> = {
  'Multiple choice': 'Multiple Choice',
  'Multiple answer': 'Multiple Answer',
  'True/False': 'True or False',
  Essay: 'Essay',
  'Fill in the blank': 'Fill in the Blank',
  Matching: 'Matching',
  Numeric: 'Numeric',
  Categorization: 'Categorization',
  Ordering: 'Ordering',
}

// Turn a handed-off question into a builder question.
function fromHandoff(h: HandoffQuestion): Question {
  const type = TYPE_MAP[h.typeLabel] ?? 'Multiple Choice'
  return {
    id: newId(),
    type,
    points: DEFAULT_POINTS[type],
    prompt: h.prompt,
    ...(type === 'Multiple Choice' ? { choices: ['Choice A', 'Choice B', 'Choice C', 'Choice D'], correct: 0 } : {}),
    ...(type === 'True or False' ? { choices: ['True', 'False'], correct: 0 } : {}),
    ...(type === 'Fill in the Blank' ? { blank: 'answer' } : {}),
  }
}

export default function NavigationExperimentation({ isDark, onToggleTheme }: PrototypeProps) {
  const { sharedTokens } = useComputedTheme()

  // Read a one-shot handoff from Question banks (if the user arrived via Add/Create quiz).
  const handoff = useMemo(() => takeQuizHandoff(), [])
  const addedFromBanks = handoff?.questions.length ?? 0

  // Arriving via a Question banks handoff jumps straight into the builder; a
  // direct visit lands on the quizzes index first.
  const [screen, setScreen] = useState<'index' | 'builder'>(handoff ? 'builder' : 'index')
  const [tab, setTab] = useState(0)
  const [questions, setQuestions] = useState<Question[]>(() => {
    if (!handoff) return INITIAL_QUESTIONS
    const added = handoff.questions.map(fromHandoff)
    // A new quiz starts with just the added questions; an existing quiz keeps its own.
    return handoff.mode === 'new' ? added : [...INITIAL_QUESTIONS, ...added]
  })
  const [quizTitle, setQuizTitle] = useState(handoff ? handoff.quizTitle : QUIZ_TITLE)
  const [pickerAt, setPickerAt] = useState<number | null>(null)
  const [settings, setSettings] = useState<Record<string, boolean>>({})
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [pointsPossible, setPointsPossible] = useState('0')
  const [loading, setLoading] = useState(false)

  // Fake a navigation delay: show a spinner for `ms`, run `after` once it clears.
  function showLoading(ms: number, after?: () => void) {
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      after?.()
    }, ms)
  }

  const card = {
    background: 'primary' as const,
    themeOverride: { backgroundPrimary: sharedTokens.background.containerColor },
    borderRadius: sharedTokens.borderRadius.card.lg,
    shadow: 'resting' as const,
  }

  function insertQuestion(type: QuestionType, at: number) {
    const q: Question = {
      id: newId(),
      type,
      points: DEFAULT_POINTS[type],
      prompt:
        type === 'Multiple Choice'
          ? 'Untitled multiple choice question'
          : type === 'True or False'
            ? 'Untitled true/false statement'
            : type === 'Fill in the Blank'
              ? 'Untitled fill in the blank'
              : `Untitled ${type.toLowerCase()} question`,
      ...(type === 'Multiple Choice'
        ? { choices: ['Choice A', 'Choice B', 'Choice C', 'Choice D'], correct: 0 }
        : {}),
      ...(type === 'True or False' ? { choices: ['True', 'False'], correct: 0 } : {}),
      ...(type === 'Fill in the Blank' ? { blank: 'answer' } : {}),
    }
    setQuestions((prev) => {
      const next = [...prev]
      next.splice(at, 0, q)
      return next
    })
    setPickerAt(null)
  }

  function duplicateQuestion(id: string) {
    setQuestions((prev) => {
      const i = prev.findIndex((q) => q.id === id)
      if (i < 0) return prev
      const copy = { ...prev[i], id: newId() }
      const next = [...prev]
      next.splice(i + 1, 0, copy)
      return next
    })
  }

  function deleteQuestion(id: string) {
    setQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  // ── Index ↔ builder navigation ──
  function openQuiz(item: QuizListItem) {
    setQuizTitle(item.title)
    // The canonical quiz carries real content; siblings open empty for prototyping.
    setQuestions(item.id === 'biology-1' ? INITIAL_QUESTIONS : [])
    setTab(0)
    setPickerAt(null)
    setScreen('builder')
    showLoading(500) // short load opening the quiz → lands on Summary
  }

  function createQuiz() {
    setQuizTitle('Untitled Quiz')
    setQuestions([])
    setTab(0)
    setPickerAt(null)
    setScreen('builder')
    showLoading(500)
  }

  /* ── Shared bits ── */
  function numberBadge(n: number) {
    return (
      <View
        as="div"
        display="inline-block"
        background="brand"
        themeOverride={{ backgroundBrand: sharedTokens.background.brandColor }}
        borderRadius={sharedTokens.borderRadius.card.md}
        padding="xxx-small x-small"
      >
        <Text color="primary-inverse" weight="bold">{n}</Text>
      </View>
    )
  }

  const radioDot = (filled: boolean) =>
    filled ? (
      <View
        as="div"
        display="inline-block"
        width="0.9rem"
        height="0.9rem"
        borderRadius="circle"
        background="brand"
        themeOverride={{ backgroundBrand: sharedTokens.background.brandColor }}
      />
    ) : (
      <View
        as="div"
        display="inline-block"
        width="0.9rem"
        height="0.9rem"
        borderRadius="circle"
        borderWidth="small"
      />
    )

  /* ── Question body, rendered per type ── */
  function questionBody(q: Question) {
    if (q.type === 'Multiple Choice' || q.type === 'True or False') {
      return (
        <Flex direction="column" gap="x-small">
          <Text as="p">{q.prompt}</Text>
          <Flex direction="column" gap="x-small" margin="x-small 0 0 0">
            {(q.choices ?? []).map((c, i) => (
              <Flex key={c} gap="x-small" alignItems="center">
                {radioDot(q.correct === i)}
                <Text weight={q.correct === i ? 'bold' : 'normal'}>{c}</Text>
              </Flex>
            ))}
          </Flex>
        </Flex>
      )
    }
    if (q.type === 'Fill in the Blank') {
      return (
        <Flex gap="x-small" alignItems="center" wrap="wrap">
          <Text>{q.prompt}</Text>
          <View
            as="div"
            display="inline-block"
            borderWidth="small"
            borderRadius={sharedTokens.borderRadius.card.md}
            padding="xxx-small small"
            background="secondary"
            themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
          >
            <Text>{q.blank}</Text>
          </View>
          <Text>.</Text>
        </Flex>
      )
    }
    if (q.type === 'Essay') {
      return (
        <Flex direction="column" gap="x-small">
          <Text as="p">{q.prompt}</Text>
          <View
            as="div"
            display="block"
            borderWidth="small"
            borderRadius={sharedTokens.borderRadius.card.md}
            margin="x-small 0 0 0"
          >
            <View
              as="div"
              display="block"
              borderWidth="0 0 small 0"
              padding="x-small small"
            >
              <Text size="small" color="secondary">Edit   View   Insert   Format   Tools   Table</Text>
            </View>
            <View as="div" display="block" height="6rem" padding="small" />
          </View>
        </Flex>
      )
    }
    // Generic placeholder for the other inserted item types
    return (
      <Text as="p" color="secondary">Configure this {q.type.toLowerCase()} question.</Text>
    )
  }

  /* ── Insert Content picker ── */
  function picker(at: number) {
    return (
      <View as="div" {...card} display="block" padding="medium" margin="x-small 0">
        <Flex justifyItems="space-between" alignItems="center" margin="0 0 small 0">
          <Heading level="h4" margin="0">Insert content</Heading>
          <Flex gap="x-small" alignItems="center">
            <IconButton size="small" withBackground={false} screenReaderLabel="Insert from item bank" renderIcon={<FolderInstUIIcon />} />
            <CloseButton size="small" screenReaderLabel="Close insert content" onClick={() => setPickerAt(null)} />
          </Flex>
        </Flex>
        <Button color="ai-primary" renderIcon={<SparklesInstUIIcon />} onClick={() => insertQuestion('Multiple Choice', at)}>
          Generate with AI
        </Button>
        <Flex margin="small 0 0 0" gap="medium" alignItems="start">
          {(['left', 'right'] as const).map((col) => (
            <Flex.Item key={col} shouldGrow shouldShrink size="0">
              <Flex direction="column">
                {ITEM_TYPES.map((row) => (
                  <Button
                    key={row[col]}
                    display="block"
                    withBackground={false}
                    renderIcon={<PlusInstUIIcon />}
                    onClick={() => insertQuestion(row[col], at)}
                  >
                    {row[col]}
                  </Button>
                ))}
              </Flex>
            </Flex.Item>
          ))}
        </Flex>
      </View>
    )
  }

  /* ── Welcome / Exit screen card ── */
  function screenCard(label: string) {
    return (
      <View as="div" display="block" borderWidth="small" borderRadius={sharedTokens.borderRadius.card.lg} padding="medium">
        <Flex justifyItems="space-between" alignItems="start" gap="small">
          <Flex.Item shouldGrow shouldShrink>
            <Text weight="bold" size="small" color="secondary">{label}</Text>
            <View as="div" display="block" margin="x-small 0 0 0">
              <Text>Please click <Text weight="bold">Start</Text> when you are ready to begin activity.</Text>
            </View>
          </Flex.Item>
          <IconButton size="small" withBackground={false} screenReaderLabel={`Edit ${label.toLowerCase()}`} renderIcon={<PencilInstUIIcon />} />
        </Flex>
      </View>
    )
  }

  /* ── A single question card in the Build canvas ── */
  function questionCard(q: Question, i: number) {
    return (
      <View as="div" display="block" key={q.id} margin="0 0 small 0">
        <View as="div" {...card} display="block" padding="medium">
          <Flex justifyItems="space-between" alignItems="start" margin="0 0 small 0">
            <Flex gap="small" alignItems="center">
              {numberBadge(i + 1)}
              <Pill>{q.type}</Pill>
              <Text color="secondary" size="small">{q.points} points</Text>
            </Flex>
            <Flex gap="xxx-small">
              <IconButton size="small" withBackground={false} screenReaderLabel={`Edit question ${i + 1}`} renderIcon={<PencilInstUIIcon />} />
              <IconButton size="small" withBackground={false} screenReaderLabel={`Duplicate question ${i + 1}`} renderIcon={<CopyInstUIIcon />} onClick={() => duplicateQuestion(q.id)} />
              <IconButton size="small" withBackground={false} screenReaderLabel={`Move question ${i + 1}`} renderIcon={<GripVerticalInstUIIcon />} />
              <IconButton size="small" withBackground={false} screenReaderLabel={`Delete question ${i + 1}`} renderIcon={<Trash2InstUIIcon />} onClick={() => deleteQuestion(q.id)} />
            </Flex>
          </Flex>
          {questionBody(q)}
        </View>
      </View>
    )
  }

  /* ─────────────── Build tab ─────────────── */
  const buildPanel = (
    <View as="div" {...card} display="block" padding="large">
      {/* Panel header */}
      <Flex justifyItems="space-between" alignItems="center" margin="0 0 medium 0" wrap="wrap" gap="small">
        <Heading level="h2" variant="titleSection" margin="0">Build</Heading>
        <Flex gap="small" wrap="wrap" alignItems="center">
          <Button renderIcon={<ChartColumnInstUIIcon />}>Overview</Button>
          <Button renderIcon={<ClipboardListInstUIIcon />}>Rubrics</Button>
          <Button renderIcon={<TargetInstUIIcon />}>Outcomes</Button>
          <Button renderIcon={<PaperclipInstUIIcon />}>Resources</Button>
          <IconButton withBackground={false} screenReaderLabel="More options" renderIcon={<EllipsisVerticalInstUIIcon />} />
        </Flex>
      </Flex>

      {addedFromBanks > 0 ? (
        <Alert variant="success" margin="0 0 medium 0" renderCloseButtonLabel="Close">
          {addedFromBanks} {addedFromBanks === 1 ? 'question' : 'questions'} added from Question banks.
        </Alert>
      ) : null}

      <Flex alignItems="stretch" gap="medium">
        {/* Builder tool rail */}
        <Flex.Item>
          <View as="div" display="block" borderWidth="small" borderRadius={sharedTokens.borderRadius.card.lg} padding="x-small">
            <Flex direction="column" alignItems="center" gap="small">
              <IconButton size="small" withBackground={false} screenReaderLabel="Toggle outline" renderIcon={<PanelLeftInstUIIcon />} />
              <View
                as="div"
                display="block"
                background="primary-inverse"
                borderRadius="circle"
                width="1.75rem"
                height="1.75rem"
                textAlign="center"
              >
                <Text color="primary-inverse" weight="bold" size="small" lineHeight="double">{questions.length}</Text>
              </View>
              <IconButton size="small" withBackground={false} screenReaderLabel="Edit" renderIcon={<SquarePenInstUIIcon />} />
              <IconButton size="small" withBackground={false} screenReaderLabel="Item checklist" renderIcon={<ClipboardCheckInstUIIcon />} />
            </Flex>
          </View>
        </Flex.Item>

        {/* Canvas */}
        <Flex.Item shouldGrow shouldShrink>
          {/* Welcome screen */}
          {screenCard('Welcome screen')}

          {/* Quiz content */}
          <View as="div" display="block" textAlign="center" margin="medium 0 small 0">
            <Text color="secondary" weight="bold">Quiz content</Text>
          </View>

          {questions.length === 0 ? (
            <View as="div" display="block" textAlign="center" padding="medium 0">
              <Text color="secondary"><NewspaperInstUIIcon size="large" /></Text>
            </View>
          ) : (
            <View as="div" display="block">
              {questions.map((q, i) => questionCard(q, i))}
            </View>
          )}

          {/* Add */}
          <View as="div" display="block" textAlign="center" margin="medium 0">
            <Button
              color="primary"
              onClick={() => setPickerAt(pickerAt === questions.length ? null : questions.length)}
            >
              Add
            </Button>
            {pickerAt === questions.length ? (
              <View as="div" display="block" margin="small 0 0 0">
                {picker(questions.length)}
              </View>
            ) : null}
          </View>

          {/* Exit screen */}
          {screenCard('Exit screen')}
        </Flex.Item>
      </Flex>
    </View>
  )

  /* ─────────────── Schedule tab (AGAMS Settings design) ─────────────── */
  // Collapsible section header bar (chevron + title on a tinted strip).
  function sectionBar(title: string, key: string) {
    const open = !collapsed[key]
    return (
      <View
        as="button"
        display="block"
        width="100%"
        textAlign="start"
        background="secondary"
        themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
        borderRadius={sharedTokens.borderRadius.card.md}
        borderWidth="0"
        padding="x-small small"
        margin="medium 0 small 0"
        cursor="pointer"
        onClick={() => setCollapsed((p) => ({ ...p, [key]: open }))}
      >
        <Flex gap="x-small" alignItems="center">
          <Text color="brand">{open ? <ChevronDownInstUIIcon /> : <ChevronRightInstUIIcon />}</Text>
          <Text weight="bold" size="small">{title}</Text>
        </Flex>
      </View>
    )
  }

  // One toggle row: switch + label, optional info icon, optional indent.
  const INDENT = ['0', '0 0 0 medium', '0 0 0 x-large']
  function toggleRow(item: ToggleItem) {
    return (
      <View as="div" display="block" key={item.label} padding="xx-small 0" margin={INDENT[item.indent ?? 0]}>
        <Flex gap="x-small" alignItems="center">
          <Checkbox
            variant="toggle"
            labelPlacement="end"
            size="small"
            label={item.label}
            checked={!!settings[item.label]}
            onChange={(e) => setSettings((prev) => ({ ...prev, [item.label]: e.target.checked }))}
          />
          {item.info ? (
            <Text color="secondary">
              <InfoInstUIIcon />
              <ScreenReaderContent>More information</ScreenReaderContent>
            </Text>
          ) : null}
        </Flex>
      </View>
    )
  }

  // Label-left / control-right field row.
  function fieldRow(label: string, control: React.ReactNode) {
    return (
      <Flex gap="small" alignItems="center" margin="0 0 small 0">
        <Flex.Item size="9rem">
          <Text>{label}</Text>
        </Flex.Item>
        <Flex.Item shouldGrow shouldShrink>{control}</Flex.Item>
      </Flex>
    )
  }

  const schedulePanel = (
    <View as="div" display="block">
      <Heading level="h2" variant="titlePageDesktop" margin="0 0 medium 0">Schedule</Heading>

      {/* Quiz-Specific Settings card */}
      <View as="div" {...card} display="block" padding="large" margin="0 0 medium 0">
        {sectionBar('Quiz-Specific Settings', 'quizSpecific')}
        {!collapsed.quizSpecific ? (
          <View as="div" display="block">
            {fieldRow(
              'Quiz type',
              <SimpleSelect renderLabel={<ScreenReaderContent>Quiz type</ScreenReaderContent>} defaultValue="Graded Quiz">
                {QUIZ_TYPE_OPTIONS.map((o) => (
                  <SimpleSelect.Option id={`qt-${o}`} key={o} value={o}>{o}</SimpleSelect.Option>
                ))}
              </SimpleSelect>,
            )}
            {fieldRow(
              'Assignment group',
              <SimpleSelect renderLabel={<ScreenReaderContent>Assignment group</ScreenReaderContent>} defaultValue="Assignment">
                {ASSIGNMENT_GROUP_OPTIONS.map((o) => (
                  <SimpleSelect.Option id={`ag-${o}`} key={o} value={o}>{o}</SimpleSelect.Option>
                ))}
              </SimpleSelect>,
            )}
            {fieldRow(
              'Points possible',
              <NumberInput
                renderLabel={<ScreenReaderContent>Points possible</ScreenReaderContent>}
                value={pointsPossible}
                onChange={(_e, v) => setPointsPossible(v)}
                onIncrement={() => setPointsPossible((p) => String((Number(p) || 0) + 1))}
                onDecrement={() => setPointsPossible((p) => String(Math.max(0, (Number(p) || 0) - 1)))}
              />,
            )}
            <View as="div" display="block" margin="small 0 0 0">
              {QUIZ_SPECIFIC_TOGGLES.map(toggleRow)}
            </View>

            {sectionBar('Assign to students', 'assign')}
            {!collapsed.assign ? (
              <View as="div" display="block">
                <Table caption="Assign to students" layout="auto">
                  <Table.Head>
                    <Table.Row>
                      <Table.ColHeader id="as-group">Group</Table.ColHeader>
                      <Table.ColHeader id="as-from">Available from</Table.ColHeader>
                      <Table.ColHeader id="as-due">Due date</Table.ColHeader>
                      <Table.ColHeader id="as-until">Until date</Table.ColHeader>
                      <Table.ColHeader id="as-edit" width="3rem"><ScreenReaderContent>Edit</ScreenReaderContent></Table.ColHeader>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>Everyone</Table.Cell>
                      <Table.Cell>—</Table.Cell>
                      <Table.Cell>—</Table.Cell>
                      <Table.Cell>—</Table.Cell>
                      <Table.Cell>
                        <IconButton size="small" withBackground={false} screenReaderLabel="Edit assignment" renderIcon={<PencilInstUIIcon />} />
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
                <View as="div" display="block" textAlign="center" margin="small 0 0 0">
                  <Button renderIcon={<PlusInstUIIcon />}>Create group</Button>
                </View>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>

      {/* Preset card */}
      <View as="div" {...card} display="block" padding="large">
        <Heading level="h3" variant="titleCardRegular" margin="0 0 x-small 0">Preset</Heading>
        <Text as="p" size="small" color="secondary">
          Save time by applying reusable presets. To view, edit, or organize all available presets, visit the <Link>Quiz Presets</Link>.
        </Text>
        <Flex gap="small" alignItems="end" margin="small 0 0 0" wrap="wrap">
          <Flex.Item shouldGrow shouldShrink>
            <SimpleSelect renderLabel={<ScreenReaderContent>Select preset</ScreenReaderContent>} defaultValue="">
              <SimpleSelect.Option id="preset-none" value="">Select preset</SimpleSelect.Option>
              <SimpleSelect.Option id="preset-standard" value="standard">Standard quiz</SimpleSelect.Option>
              <SimpleSelect.Option id="preset-exam" value="exam">Proctored exam</SimpleSelect.Option>
              <SimpleSelect.Option id="preset-practice" value="practice">Practice</SimpleSelect.Option>
            </SimpleSelect>
          </Flex.Item>
          <Flex.Item>
            <Button interaction="disabled">Save as a new preset</Button>
          </Flex.Item>
        </Flex>

        {/* Scoring */}
        {sectionBar('Scoring', 'scoring')}
        {!collapsed.scoring ? (
          <View as="div" display="block">
            {fieldRow(
              'Type',
              <SimpleSelect renderLabel={<ScreenReaderContent>Scoring type</ScreenReaderContent>} defaultValue="Points">
                {SCORING_TYPE_OPTIONS.map((o) => (
                  <SimpleSelect.Option id={`st-${o}`} key={o} value={o}>{o}</SimpleSelect.Option>
                ))}
              </SimpleSelect>,
            )}
            {SCORING_TOGGLES.map(toggleRow)}
          </View>
        ) : null}

        {/* Restrict access */}
        {sectionBar('Restrict access', 'restrict')}
        {!collapsed.restrict ? <View as="div" display="block">{RESTRICT_TOGGLES.map(toggleRow)}</View> : null}

        {/* Display */}
        {sectionBar('Display', 'display')}
        {!collapsed.display ? <View as="div" display="block">{DISPLAY_TOGGLES.map(toggleRow)}</View> : null}

        {/* Release Results */}
        {sectionBar('Release Results', 'release')}
        {!collapsed.release ? (
          <View as="div" display="block">
            <View as="div" display="block" margin="x-small 0">
              <Flex gap="x-small" alignItems="center">
                <Text weight="bold">Final scores</Text>
                <Text color="secondary"><InfoInstUIIcon /><ScreenReaderContent>More information</ScreenReaderContent></Text>
              </Flex>
            </View>
            {RELEASE_FINAL_SCORES.map(toggleRow)}
            <View as="div" display="block" margin="small 0 x-small 0"><Text weight="bold">Results</Text></View>
            {RELEASE_RESULTS.map(toggleRow)}
            <View as="div" display="block" margin="small 0 x-small 0"><Text weight="bold">Feedback</Text></View>
            {RELEASE_FEEDBACK.map(toggleRow)}
          </View>
        ) : null}
      </View>
    </View>
  )

  /* ─────────────── Moderate tab ─────────────── */
  const moderatePanel = (
    <View as="div" {...card} display="block" padding="large">
      <Flex justifyItems="space-between" alignItems="center" margin="0 0 medium 0" wrap="wrap" gap="small">
        <Heading level="h2" variant="titleSection" margin="0">Moderate</Heading>
        <Button renderIcon={<GaugeInstUIIcon />}>SpeedGrader</Button>
      </Flex>
      <Flex gap="small" alignItems="end" margin="0 0 medium 0" wrap="wrap">
        <Flex.Item shouldGrow shouldShrink>
          <TextInput
            renderLabel={<ScreenReaderContent>Search students</ScreenReaderContent>}
            placeholder="Search by name or exact ID"
            renderBeforeInput={<SearchInstUIIcon />}
          />
        </Flex.Item>
        <Flex.Item>
          <SimpleSelect renderLabel={<ScreenReaderContent>Filter</ScreenReaderContent>} defaultValue="all">
            <SimpleSelect.Option id="show-all" value="all">Show All</SimpleSelect.Option>
            <SimpleSelect.Option id="show-submitted" value="submitted">Submitted</SimpleSelect.Option>
            <SimpleSelect.Option id="show-not-started" value="not-started">Not started</SimpleSelect.Option>
          </SimpleSelect>
        </Flex.Item>
      </Flex>
      <View as="div" {...card} display="block" padding="x-small medium">
        <Table caption="Student attempts" layout="fixed">
          <Table.Head>
            <Table.Row>
              <Table.ColHeader id="m-student">Student</Table.ColHeader>
              <Table.ColHeader id="m-attempts">Attempts</Table.ColHeader>
              <Table.ColHeader id="m-score">Score</Table.ColHeader>
              <Table.ColHeader id="m-time">Time</Table.ColHeader>
              <Table.ColHeader id="m-log">Log</Table.ColHeader>
              <Table.ColHeader id="m-accom">Accommodations</Table.ColHeader>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {STUDENTS.map((s) => (
              <Table.Row key={s.id}>
                <Table.Cell>
                  <Flex gap="x-small" alignItems="center">
                    <Avatar name={s.name} size="x-small" />
                    <Link>{s.name}</Link>
                  </Flex>
                </Table.Cell>
                <Table.Cell>{s.attempts === '—' ? s.attempts : <Link>{s.attempts}</Link>}</Table.Cell>
                <Table.Cell>{s.score}</Table.Cell>
                <Table.Cell>{s.time}</Table.Cell>
                <Table.Cell>{s.log ? <Link>View Log</Link> : '—'}</Table.Cell>
                <Table.Cell>{s.accommodations}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </View>
    </View>
  )

  /* ─────────────── Reports tab ─────────────── */
  const reportsPanel = (
    <View as="div" {...card} display="block" padding="large">
      <Heading level="h2" variant="titleSection" margin="0 0 medium 0">Reports</Heading>
      <Flex gap="medium" alignItems="stretch" wrap="wrap">
        {REPORTS.map((r) => (
          <Flex.Item key={r.title} shouldGrow shouldShrink size="16rem">
            <View as="div" {...card} display="block" padding="medium" height="100%">
              <Flex direction="column" gap="large" height="100%" justifyItems="space-between">
                <Flex justifyItems="space-between" alignItems="start" gap="small">
                  <Heading level="h3" variant="titleCardRegular" margin="0">{r.title}</Heading>
                  {r.action === 'Export CSV' ? (
                    <Button size="small" interaction="disabled">Export CSV</Button>
                  ) : null}
                </Flex>
                <Flex justifyItems={r.link ? 'end' : 'start'}>
                  {r.action === 'View Report' ? (
                    <Link>View Report</Link>
                  ) : (
                    <Link>{r.link}</Link>
                  )}
                </Flex>
              </Flex>
            </View>
          </Flex.Item>
        ))}
      </Flex>
    </View>
  )

  /* ─────────────── Summary tab (landing) ─────────────── */
  const summaryPanel = (
    <View as="div" {...card} display="block" padding="large">
      <Heading level="h2" variant="titleSection" margin="0 0 medium 0">Summary</Heading>

      {/* Settings summary */}
      <View as="div" display="block" margin="0 0 large 0">
        <View as="div" display="block" margin="0 0 small 0"><Text weight="bold">Settings</Text></View>
        <Flex gap="large" wrap="wrap" alignItems="start">
          {SUMMARY_COLUMNS.map((col, i) => (
            <Flex.Item key={i} shouldGrow shouldShrink size="14rem">
              <Flex direction="column" gap="x-small">
                {col.map(({ label, value }) => (
                  <Text key={label} color="secondary">
                    {label}: <Text weight="bold" color="primary">{value}</Text>
                  </Text>
                ))}
              </Flex>
            </Flex.Item>
          ))}
        </Flex>
      </View>

      {/* Assign to students */}
      <View as="div" display="block">
        <View as="div" display="block" margin="0 0 small 0"><Text weight="bold">Assign to students</Text></View>
        <Table caption="Assignment summary" layout="auto">
          <Table.Head>
            <Table.Row>
              <Table.ColHeader id="sum-group">Groups</Table.ColHeader>
              <Table.ColHeader id="sum-available">Available from</Table.ColHeader>
              <Table.ColHeader id="sum-due">Due date</Table.ColHeader>
              <Table.ColHeader id="sum-until">Until date</Table.ColHeader>
              <Table.ColHeader id="sum-show">Show results</Table.ColHeader>
              <Table.ColHeader id="sum-hide">Hide results</Table.ColHeader>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {SUMMARY_ASSIGN.map((r) => (
              <Table.Row key={r.group}>
                <Table.Cell>{r.group}</Table.Cell>
                <Table.Cell>{r.available}</Table.Cell>
                <Table.Cell>{r.due}</Table.Cell>
                <Table.Cell>{r.until}</Table.Cell>
                <Table.Cell>{r.showResults}</Table.Cell>
                <Table.Cell>{r.hideResults}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </View>
    </View>
  )

  const panels = [summaryPanel, buildPanel, schedulePanel, moderatePanel, reportsPanel]

  /* ─────────────── Quizzes index (first screen) ─────────────── */
  function quizRow(item: QuizListItem, last: boolean) {
    return (
      <View
        as="div"
        display="block"
        key={item.id}
        borderWidth={last ? '0' : '0 0 small 0'}
        padding="small 0"
      >
        <Flex justifyItems="space-between" alignItems="center" gap="small">
          <Flex gap="small" alignItems="start">
            <Text color={item.published ? 'success' : 'secondary'}>
              {item.published ? <CircleCheckInstUIIcon /> : <CircleSlashInstUIIcon />}
              <ScreenReaderContent>{item.published ? 'Published' : 'Unpublished'}</ScreenReaderContent>
            </Text>
            <Flex direction="column" gap="xxx-small">
              <Flex gap="x-small" alignItems="center">
                <Text color="secondary" size="small"><RocketInstUIIcon /></Text>
                <Link onClick={() => openQuiz(item)}>{item.title}</Link>
              </Flex>
              <Text size="small" color="secondary">
                {item.due === 'No due date' ? 'No due date' : `Due ${item.due}`}
                {' · '}{item.points} {item.points === 1 ? 'pt' : 'pts'}
                {' · '}{item.questions} {item.questions === 1 ? 'question' : 'questions'}
              </Text>
            </Flex>
          </Flex>
          <IconButton
            size="small"
            withBackground={false}
            screenReaderLabel={`Options for ${item.title}`}
            renderIcon={<EllipsisVerticalInstUIIcon />}
          />
        </Flex>
      </View>
    )
  }

  /* ─────────────── Second-layer course navigation (permanent) ─────────────── */
  function courseNavItem(label: string, selected: boolean) {
    return (
      <View
        as="div"
        display="block"
        width="100%"
        background={selected ? 'primary-inverse' : 'transparent'}
        borderRadius={sharedTokens.borderRadius.card.md}
        padding="x-small small"
      >
        <Text color={selected ? 'primary-inverse' : 'primary'} weight={selected ? 'bold' : 'normal'}>
          {label}
        </Text>
      </View>
    )
  }

  const courseNav = (
    <View
      as="nav"
      {...card}
      height="100%"
      display="block"
      width="14rem"
      overflowY="auto"
      padding="small"
    >
      <Flex direction="column" gap="xxx-small">
        {COURSE_NAV.map((item) => (
          <View as="div" display="block" key={item}>
            {courseNavItem(item, item === ACTIVE_COURSE_NAV)}
          </View>
        ))}
      </Flex>
    </View>
  )

  const indexScreen = (
    <View as="div" display="block">
      <Flex justifyItems="space-between" alignItems="center" margin="0 0 large 0" wrap="wrap" gap="small">
        <Heading level="h1" variant="titlePageDesktop" margin="0">Quizzes</Heading>
        <Button color="primary" renderIcon={<PlusInstUIIcon />} onClick={createQuiz}>Quiz</Button>
      </Flex>

      <Flex direction="column" gap="large">
        {QUIZ_GROUPS.map((group) => {
          const items = QUIZ_INDEX.filter((q) => q.group === group)
          if (items.length === 0) return null
          return (
            <View as="div" display="block" key={group}>
              <Heading level="h2" variant="titleSection" margin="0 0 small 0">{group}</Heading>
              <View as="div" {...card} display="block" padding="x-small medium">
                {items.map((item, i) => quizRow(item, i === items.length - 1))}
              </View>
            </View>
          )
        })}
      </Flex>
    </View>
  )

  /* ─────────────── Builder screen ─────────────── */
  const builderScreen = (
    <View as="div" display="block">
      {/* Page header */}
      <Flex justifyItems="space-between" alignItems="start" wrap="wrap" gap="small" margin="0 0 medium 0">
        <Flex.Item shouldGrow shouldShrink>
          <Flex gap="x-small" alignItems="center">
            <Heading level="h1" variant="titlePageDesktop" margin="0">{quizTitle}</Heading>
            <IconButton withBackground={false} size="small" screenReaderLabel="Rename quiz" renderIcon={<PencilInstUIIcon />} />
          </Flex>
          <View as="div" display="block" margin="xx-small 0 0 0">
            <Text size="small" color="secondary">Created by alex.rivera@instructure.com on Jun 22, 2026 | Saved just now</Text>
          </View>
        </Flex.Item>
        <Button color="primary" renderIcon={<RocketInstUIIcon />}>Publish</Button>
      </Flex>

      {/* Tabs (InstUI) */}
      <Tabs
        onRequestTabChange={(_e, { index }) => {
          // Leaving Summary for another tab → longer load (entering the page).
          if (tab === 0 && index !== 0) {
            setTab(index)
            showLoading(1600)
          } else {
            setTab(index)
          }
        }}
      >
        {TABS.map((title, i) => (
          <Tabs.Panel
            key={title}
            renderTitle={title}
            isSelected={tab === i}
            padding="none"
            themeOverride={{ defaultOverflowY: 'visible' }}
          >
            <View as="div" display="block" margin="medium 0 0 0">
              {panels[i]}
            </View>
          </Tabs.Panel>
        ))}
      </Tabs>
    </View>
  )

  /* ─────────────── Chrome ─────────────── */
  return (
    <View
      as="div"
      height="100vh"
      overflowX="hidden"
      overflowY="hidden"
      background="secondary"
      themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
      display="block"
      padding="medium"
    >
      <Flex height="100%" width="100%" alignItems="stretch" gap="small">
        {/* Global navigation rail (first layer) — permanent, same card as the others */}
        <View as="div" {...card} height="100%" display="block" overflowY="hidden">
          <SideNavBar
            label="Main navigation"
            toggleLabel={{ expandedLabel: 'Minimize navigation', minimizedLabel: 'Expand navigation' }}
            themeOverride={{ boxShadow: [] } as Record<string, unknown>}
          >
            <SideNavBar.Item
              icon={<IconCanvasLogoSolid size="medium" />}
              label={<ScreenReaderContent>Canvas</ScreenReaderContent>}
              href="#"
              themeOverride={{ contentPadding: '1em 0.375rem 1em 0.375rem' }}
            />
            <SideNavBar.Item icon={<Avatar name="Instructor" size="x-small" />} label="Account" href="#" />
            <SideNavBar.Item icon={<SettingsInstUIIcon />} label="Admin" href="#" />
            <SideNavBar.Item icon={<LayoutDashboardInstUIIcon />} label="Dashboard" href="#" />
            <SideNavBar.Item icon={<BookOpenInstUIIcon />} label="Courses" href="#" selected />
            <SideNavBar.Item icon={<CalendarDaysInstUIIcon />} label="Calendar" href="#" />
            <SideNavBar.Item icon={<InboxInstUIIcon />} label="Inbox" href="#" />
            <SideNavBar.Item icon={<ClockInstUIIcon />} label="History" href="#" />
            <SideNavBar.Item icon={<CircleHelpInstUIIcon />} label="Help" href="#" />
            <SideNavBar.Item
              icon={isDark ? <SunInstUIIcon /> : <MoonInstUIIcon />}
              label="Theme"
              onClick={onToggleTheme}
            />
          </SideNavBar>
        </View>

        {/* Right area: permanent breadcrumb bar, then course nav + content */}
        <Flex.Item shouldGrow shouldShrink>
          <Flex direction="column" height="100%" gap="small">
            {/* Top breadcrumb bar (permanent) */}
            <Flex.Item padding="0 xx-small">
              <View as="div" {...card} display="block" padding="small medium">
                <Flex gap="small" alignItems="center">
                  <IconButton withBackground={false} size="small" screenReaderLabel="Course menu" renderIcon={<AlignJustifyInstUIIcon />} />
                  <Breadcrumb label="You are here:" size="medium">
                    <Breadcrumb.Link onClick={() => setScreen('index')}>Level 1</Breadcrumb.Link>
                    <Breadcrumb.Link>Current Level</Breadcrumb.Link>
                  </Breadcrumb>
                </Flex>
              </View>
            </Flex.Item>

            {/* Course nav (second layer, permanent) + content.
                padding gives the card shadows a gutter so overflow:hidden doesn't clip them. */}
            <Flex.Item shouldGrow shouldShrink overflowY="hidden" padding="xx-small">
              <Flex height="100%" alignItems="stretch" gap="small">
                {courseNav}
                <Flex.Item shouldGrow shouldShrink overflowY="auto">
                  <View as="div" maxWidth="68rem" display="block" margin="0 auto" width="100%">
                    {loading ? (
                      <View as="div" display="block" textAlign="center" padding="xx-large 0">
                        <Spinner renderTitle="Loading" />
                      </View>
                    ) : screen === 'index' ? (
                      indexScreen
                    ) : (
                      builderScreen
                    )}
                  </View>
                </Flex.Item>
              </Flex>
            </Flex.Item>
          </Flex>
        </Flex.Item>
      </Flex>
    </View>
  )
}
