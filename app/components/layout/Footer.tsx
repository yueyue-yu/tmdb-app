function Footer() {
    return (
        // 使用 'footer-center' 来简化居中布局
        <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">

            {/* 直接将内容作为 footer 的子元素，移除了不必要的 div 嵌套 */}
            <div className="flex items-center gap-3">
                {/* TMDb Logo 和链接 */}
                <a
                    href="https://www.themoviedb.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0"
                    title="The Movie Database (TMDb)"
                >
                    <img
                        src="/tmdb-logo.svg"
                        alt="The Movie Database (TMDb) Logo"
                        className="w-12 h-auto"
                    />
                </a>
                <div className="text-xs text-left">
                    <p className="font-semibold">Data provided by TMDb</p>
                    <p className="opacity-70">
                        This product uses the TMDb API but is not endorsed or certified by TMDb.
                    </p>
                </div>
            </div>

        </footer>
    );
}

export default Footer;