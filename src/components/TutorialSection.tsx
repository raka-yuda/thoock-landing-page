export default function TutorialSection() {
  return <section className="section container tutorial-section" id="tutorial" aria-labelledby="tutorial-title">
    <div className="tutorial-heading"><div><span className="section-kicker">See Thoock in action</span><h2 id="tutorial-title">From an opportunity<br />to a finished package.</h2></div><p>Follow a batch through research, briefs, image review, and export.<span className="tutorial-duration">2 min 28 sec · Sound and English captions</span></p></div>
    <div className="tutorial-player"><video controls playsInline preload="none" poster="/videos/thoock-tutorial-poster.jpg" width="1920" height="1080" aria-label="Thoock desktop workflow tutorial"><source src="/videos/thoock-tutorial.mp4" type="video/mp4" /><track kind="captions" src="/videos/thoock-tutorial.vtt" srcLang="en" label="English" default /><p><a href="/videos/thoock-tutorial.mp4">Watch the Thoock tutorial</a></p></video></div>
  </section>;
}
