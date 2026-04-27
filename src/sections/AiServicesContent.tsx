import React, { useMemo, useState } from 'react';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

interface AiServicesContentProps {
  isAuthenticated: boolean;
  onOpenAuthModal: (mode: 'login' | 'signup') => void;
  onOpenChatbot: () => void;
}

interface Paper {
  id: string;
  title: string;
  authors: string;
  tags: string[];
  citations: string[];
  abstract: string;
  published: string;
}

interface LeaderboardEntry {
  name: string;
  score: number;
}

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  tags: string[];
  icon: JSX.Element;
}

const paperLibrary: Paper[] = [
  {
    id: 'p1',
    title: 'AI-Assisted Literature Review for Deep Learning',
    authors: 'S. Patel, M. Chen',
    tags: ['AI', 'ML', 'NLP'],
    citations: ['p2', 'p3'],
    abstract: 'A content-based recommendation system for research papers and AI-driven literature review automation.',
    published: 'Jan 2025',
  },
  {
    id: 'p2',
    title: 'Semantic Search with Embeddings for Academic Retrieval',
    authors: 'L. Gomez, H. Lee',
    tags: ['Search', 'Embeddings', 'AI'],
    citations: ['p3'],
    abstract: 'Embedding-based semantic search improves query understanding beyond traditional keyword matching.',
    published: 'Mar 2025',
  },
  {
    id: 'p3',
    title: 'Citation Graph Analysis for Research Discovery',
    authors: 'A. Singh, R. Kumar',
    tags: ['Graph', 'Citation', 'Visualization'],
    citations: ['p4'],
    abstract: 'An interactive citation graph model helps researchers explore relationships among papers.',
    published: 'Jun 2024',
  },
  {
    id: 'p4',
    title: 'Gamified Reputation Scoring for Academic Collaboration',
    authors: 'E. White, T. Zhou',
    tags: ['Reputation', 'Collaboration', 'Gamification'],
    citations: [],
    abstract: 'A reputation score system incentivizes contributions through points and leaderboards.',
    published: 'Sep 2024',
  },
  {
    id: 'p5',
    title: 'Automated Research Digest Generation Using NLP',
    authors: 'J. Kim, F. Alvarez',
    tags: ['Summary', 'NLP', 'AI'],
    citations: ['p1', 'p2'],
    abstract: 'Weekly summaries help researchers stay informed with key papers and insights.',
    published: 'Nov 2025',
  },
];

const leaderboardData: LeaderboardEntry[] = [
  { name: 'su', score: 180 },
  { name: 's1', score: 150 },
  { name: 'maria', score: 105 },
];

const availableInterests = ['AI', 'ML', 'NLP', 'CV', 'Web', 'Search', 'Graph', 'Gamification'];

const featureCards: FeatureCard[] = [
  {
    id: 'research-feed',
    title: 'Research Feed',
    description: 'Personalized paper recommendations based on your interests.',
    tags: ['Feed', 'Content-based', 'Tags'],
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor">
        <path d="M4 6h16M4 12h12M4 18h8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'semantic-search',
    title: 'Semantic Search',
    description: 'Retrieve papers by meaning using vector similarity.',
    tags: ['Search', 'Embeddings', 'Query'],
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor">
        <circle cx="11" cy="11" r="7" strokeWidth="2" />
        <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'citation-graph',
    title: 'Citation Graph',
    description: 'Explore connections between papers via citations.',
    tags: ['Graph', 'Network', 'Visual'],
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor">
        <path d="M6 6v4m0 4v4m12-12v4m0 4v4M6 10h12M6 14h12" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'reputation-score',
    title: 'Reputation Score',
    description: 'Earn points for uploads, comments, and collaborations.',
    tags: ['Gamification', 'Score', 'Leaderboard'],
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor">
        <path d="M12 8v4l2 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="9" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: 'smart-digest',
    title: 'Smart Digest',
    description: 'Generate weekly research summaries with AI.',
    tags: ['Summary', 'Digest', 'NLP'],
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor">
        <path d="M4 6h16M4 12h16M4 18h8" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'ai-chatbot',
    title: 'AI Chatbot',
    description: 'Ask research questions and get instant guidance from an AI assistant.',
    tags: ['Chatbot', 'Assistant', 'Conversational'],
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 9h8M8 13h4" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

const AiServicesContent: React.FC<AiServicesContentProps> = ({ isAuthenticated, onOpenAuthModal, onOpenChatbot }) => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['AI', 'ML']);
  const [semanticQuery, setSemanticQuery] = useState('');
  const [semanticResults, setSemanticResults] = useState<Paper[]>([]);
  const [activeGraphPaper, setActiveGraphPaper] = useState<Paper>(paperLibrary[0]);
  const [contributionScore, setContributionScore] = useState(120);
  const [recentActions, setRecentActions] = useState<string[]>(['Uploaded a paper', 'Commented on a discussion', 'Joined a project']);
  const [weeklyDigest, setWeeklyDigest] = useState('');
  const [isSummarizerModalOpen, setIsSummarizerModalOpen] = useState(false);
  const [summarizerResult, setSummarizerResult] = useState('');
  const [loadingSummarizer, setLoadingSummarizer] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);

  const recommendedPapers = useMemo(() => {
    return paperLibrary
      .map((paper) => ({
        paper,
        score: paper.tags.filter((tag) => selectedInterests.includes(tag)).length,
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.paper);
  }, [selectedInterests]);

  const openFeature = (featureId: string) => {
    setActiveFeature(featureId);
  };

  const openPaper = (paper: Paper) => {
    setSelectedPaper(paper);
    setActiveFeature('paper-detail');
  };

  const closeFeature = () => {
    setActiveFeature(null);
    setSelectedPaper(null);
  };

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((current) =>
      current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest]
    );
  };

  const handleSemanticSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      onOpenAuthModal('login');
      return;
    }

    const queryTerms = semanticQuery.toLowerCase().split(/\W+/).filter(Boolean);

    const scored = paperLibrary
      .map((paper) => {
        const score = paper.tags.reduce((total, tag) => total + queryTerms.filter((term) => tag.toLowerCase().includes(term)).length, 0);
        return { paper, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.paper);

    setSemanticResults(scored.length ? scored : paperLibrary);
  };

  const handleGenerateDigest = () => {
    if (!isAuthenticated) {
      onOpenAuthModal('login');
      return;
    }

    const topPapers = recommendedPapers.slice(0, 3).map((paper) => `• ${paper.title} (${paper.published})`).join('\n');
    setWeeklyDigest(
      `This week, you explored ${selectedInterests.length} research areas and completed ${recentActions.length} activities. Top papers to review:\n${topPapers}\nKeep collaborating and submit more findings to increase your reputation score.`
    );
  };

  const handleAddContribution = (type: 'upload' | 'comment' | 'collaborate') => {
    if (!isAuthenticated) {
      onOpenAuthModal('login');
      return;
    }

    const points = type === 'upload' ? 10 : type === 'comment' ? 5 : 15;
    const actionLabel = type === 'upload' ? 'Uploaded a paper' : type === 'comment' ? 'Posted a comment' : 'Collaborated on a project';
    setContributionScore((score) => score + points);
    setRecentActions((actions) => [actionLabel, ...actions].slice(0, 5));
  };

  const handleSummarize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      onOpenAuthModal('login');
      return;
    }

    const textToSummarize = (e.target as HTMLFormElement)['text-to-summarize'].value;
    if (!textToSummarize) return;

    setLoadingSummarizer(true);
    setSummarizerResult('');

    try {
      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSummarize }),
      });
      const data = await response.json();
      if (response.ok) {
        setSummarizerResult(data.summary);
      } else {
        setSummarizerResult('Unable to summarize the document at this time.');
      }
    } catch (error) {
      console.error('Frontend summarization error:', error);
      setSummarizerResult('An error occurred. Please try again.');
    } finally {
      setLoadingSummarizer(false);
    }
  };

  const activeFeatureData = featureCards.find((feature) => feature.id === activeFeature);

  return (
    <section id="ai-services-content" className="md:col-span-1">
      <div className="space-y-6">
        <div className="rounded-[20px] border border-slate-800 bg-slate-950/90 p-8 shadow-2xl">
          <h1 className="text-4xl font-semibold text-white">AI Research Services</h1>
          <p className="text-slate-300 mt-3 max-w-2xl">Intelligent tools to enhance research discovery and collaboration.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {featureCards.map((feature) => (
            <button
              key={feature.id}
              onClick={() => openFeature(feature.id)}
              className="group rounded-[16px] border border-slate-800 bg-slate-900 p-6 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-500 hover:bg-slate-950"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-slate-200 transition group-hover:bg-blue-600 group-hover:text-white">
                {feature.icon}
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-slate-400">{feature.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {feature.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      <Modal
        title={activeFeature === 'paper-detail' ? selectedPaper?.title ?? 'Paper details' : activeFeatureData?.title ?? ''}
        isOpen={Boolean(activeFeatureData) || activeFeature === 'paper-detail'}
        onClose={closeFeature}
      >
        {activeFeature === 'research-feed' && (
          <div className="space-y-6">
            <p className="text-slate-500">Build a personalized research feed by selecting interests aligned with your goals.</p>
            <div className="flex flex-wrap gap-3">
              {availableInterests.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    selectedInterests.includes(interest)
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
            <div className="space-y-4">
              {recommendedPapers.length > 0 ? (
                recommendedPapers.map((paper) => (
                  <button
                    key={paper.id}
                    type="button"
                    onClick={() => openPaper(paper)}
                    className="w-full text-left rounded-3xl border border-slate-800 bg-slate-950 p-4 transition-colors duration-200 hover:border-blue-500 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <p className="text-slate-400 text-xs uppercase tracking-[0.24em]">{paper.published}</p>
                    <h3 className="mt-2 text-lg font-semibold text-white">{paper.title}</h3>
                    <p className="mt-2 text-slate-400 text-sm">{paper.abstract}</p>
                  </button>
                ))
              ) : (
                <p className="text-slate-400">No recommendations available yet. Add more interests to refine your feed.</p>
              )}
            </div>
          </div>
        )}

        {activeFeature === 'semantic-search' && (
          <div className="space-y-6">
            <p className="text-slate-500">Perform semantic retrieval that prioritizes meaning over exact keyword matches.</p>
            <form className="space-y-4" onSubmit={handleSemanticSearch}>
              <input
                value={semanticQuery}
                onChange={(e) => setSemanticQuery(e.target.value)}
                placeholder="Search research papers..."
                className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-5 py-3 text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition">Search</button>
            </form>
            <div className="space-y-4">
              {(semanticResults.length > 0 ? semanticResults : paperLibrary).map((paper) => (
                <button
                  key={paper.id}
                  type="button"
                  onClick={() => openPaper(paper)}
                  className="w-full text-left rounded-3xl border border-slate-800 bg-slate-950 p-4 transition-colors duration-200 hover:border-blue-500 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <h3 className="text-lg font-semibold text-white">{paper.title}</h3>
                  <p className="mt-1 text-slate-400 text-sm">{paper.authors}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeFeature === 'citation-graph' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-slate-900">Citation Graph</h2>
            <p className="text-slate-600">Explore how research papers are connected through citation relationships.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {paperLibrary.map((paper) => (
                <button
                  key={paper.id}
                  onClick={() => {
                    setActiveGraphPaper(paper);
                    openPaper(paper);
                  }}
                  className={`rounded-3xl border p-4 text-left transition-colors duration-200 ${
                    activeGraphPaper.id === paper.id
                      ? 'border-blue-500 bg-slate-900 text-white shadow-sm'
                      : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-blue-500 hover:bg-slate-900 hover:text-white'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                >
                  <h3 className="font-semibold">{paper.title}</h3>
                  <p className="mt-1 text-slate-400 text-sm">{paper.authors}</p>
                </button>
              ))}
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-slate-400 text-xs uppercase tracking-[0.24em]">Selected paper</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{activeGraphPaper.title}</h3>
              <p className="mt-2 text-slate-400">Citations: {activeGraphPaper.citations.length || 'None'}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
                {activeGraphPaper.citations.length > 0 ? (
                  activeGraphPaper.citations.map((citationId) => {
                    const cited = paperLibrary.find((item) => item.id === citationId);
                    return (
                      <span key={citationId} className="rounded-full bg-slate-900 px-3 py-1">
                        {cited?.title ?? citationId}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-slate-500">No citations available</span>
                )}
              </div>
            </div>
          </div>
        )}

        {activeFeature === 'reputation-score' && (
          <div className="space-y-6">
            <p className="text-slate-500">Earn research reputation by contributing to papers, discussions, and collaborations.</p>
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-slate-400 uppercase text-xs tracking-[0.24em]">Current reputation</p>
              <p className="mt-3 text-5xl font-semibold text-white">{contributionScore}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button onClick={() => handleAddContribution('upload')} className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition">Upload +10</button>
                <button onClick={() => handleAddContribution('comment')} className="rounded-full bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-600 transition">Comment +5</button>
                <button onClick={() => handleAddContribution('collaborate')} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition">Collaborate +15</button>
              </div>
              <div className="mt-6 space-y-2">
                <p className="text-slate-300 font-semibold">Recent actions</p>
                {recentActions.map((action, index) => (
                  <p key={index} className="text-slate-400 text-sm">• {action}</p>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-slate-300 text-sm font-semibold">Leaderboard</p>
              <div className="mt-3 space-y-2">
                {leaderboardData.map((entry) => (
                  <div key={entry.name} className="flex items-center justify-between text-sm text-slate-300">
                    <span>{entry.name}</span>
                    <span className="font-semibold text-white">{entry.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeFeature === 'ai-chatbot' && (
          <div className="space-y-6">
            <p className="text-slate-500">Talk to the research assistant for instant help on papers, methods, and next steps.</p>
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-slate-400 text-sm">Use the AI chatbot to refine search strategies, summarize findings, or check citation connections.</p>
              <button onClick={onOpenChatbot} className="mt-5 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition">Open AI Chatbot</button>
            </div>
          </div>
        )}

        {activeFeature === 'smart-digest' && (
          <div className="space-y-6">
            <p className="text-slate-500">Generate a short weekly digest that summarizes your research activity.</p>
            <div className="flex flex-wrap gap-3">
              <button onClick={handleGenerateDigest} className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition">Generate Digest</button>
              <button type="button" onClick={() => setIsSummarizerModalOpen(true)} className="rounded-full bg-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-600 transition">Open Smart Summarizer</button>
            </div>
            {weeklyDigest ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5 text-slate-300 whitespace-pre-line">{weeklyDigest}</div>
            ) : (
              <p className="text-slate-400">Click the button to generate a summary based on your active research feed.</p>
            )}
          </div>
        )}

        {activeFeature === 'paper-detail' && selectedPaper && (
          <div className="space-y-6">
            <p className="text-slate-500">Explore this paper across the AI research workflow.</p>
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-slate-400 uppercase text-xs tracking-[0.24em]">Selected paper</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">{selectedPaper.title}</h3>
              <p className="mt-2 text-slate-400">{selectedPaper.authors}</p>
              <p className="mt-3 text-slate-300 text-sm">{selectedPaper.abstract}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedPaper.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-900 px-3 py-1 text-xs text-slate-300">{tag}</span>
                ))}
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-slate-300 font-semibold">Research Feed Context</p>
                <p className="mt-3 text-slate-400 text-sm">This paper fits your active interests and can be used to tune recommendations across the service.</p>
                <div className="mt-4 space-y-2">
                  {selectedPaper.tags.map((tag) => (
                    <span key={tag} className="inline-flex rounded-full bg-blue-600/10 px-3 py-1 text-xs text-blue-300">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-slate-300 font-semibold">Semantic Matches</p>
                <div className="mt-3 space-y-2">
                  {paperLibrary
                    .filter((paper) => paper.id !== selectedPaper.id && paper.tags.some((tag) => selectedPaper.tags.includes(tag)))
                    .slice(0, 3)
                    .map((paper) => (
                      <button
                        key={paper.id}
                        type="button"
                        onClick={() => openPaper(paper)}
                        className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2 text-left text-slate-200 hover:border-blue-500"
                      >
                        <p className="font-semibold">{paper.title}</p>
                        <p className="text-slate-400 text-xs">{paper.authors}</p>
                      </button>
                    ))}
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-slate-300 font-semibold">Citation Graph</p>
              <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-300">
                {paperLibrary.filter((paper) => paper.citations.includes(selectedPaper.id)).length > 0 ? (
                  paperLibrary.filter((paper) => paper.citations.includes(selectedPaper.id)).map((paper) => (
                    <button
                      key={paper.id}
                      type="button"
                      onClick={() => openPaper(paper)}
                      className="rounded-full bg-slate-900 px-3 py-1 text-slate-200 hover:bg-blue-700/20"
                    >
                      {paper.title}
                    </button>
                  ))
                ) : (
                  <span className="text-slate-500">No papers currently cite this item.</span>
                )}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-slate-300 font-semibold">Take action</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button onClick={() => setActiveFeature('research-feed')} className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition">Open Research Feed</button>
                <button onClick={() => setActiveFeature('semantic-search')} className="rounded-full bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-600 transition">Open Semantic Search</button>
                <button onClick={() => setActiveFeature('citation-graph')} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition">Open Citation Graph</button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal title="🌟 Smart Summarizer" isOpen={isSummarizerModalOpen} onClose={() => setIsSummarizerModalOpen(false)}>
        <form id="summarizer-form" className="space-y-4" onSubmit={handleSummarize}>
          <div>
            <label htmlFor="text-to-summarize" className="block text-gray-700 font-medium mb-1">Paste your report or article text below</label>
            <textarea id="text-to-summarize" rows={10} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Paste the content of your report, paper section, or article here."></textarea>
          </div>
          <button type="submit" id="summarize-button" className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition">Summarize</button>
        </form>
        {loadingSummarizer && <LoadingSpinner />}
        {summarizerResult && (
          <div id="summary-result" className="p-4 bg-gray-100 rounded-lg mt-4">
            <h3 className="font-bold text-gray-800">Summary:</h3>
            <p className="mt-2">{summarizerResult}</p>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default AiServicesContent;
