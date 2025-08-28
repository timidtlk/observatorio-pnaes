import { useLayoutEffect, useRef } from "react";

export default function VLibras() {
	const containerRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		const container = containerRef.current;
		if (container) {
			container.setAttribute("vw", "");
			const accessButton = container.querySelector("[data-vw-access-button]");
			if (accessButton) accessButton.setAttribute("vw-access-button", "");
			const pluginWrapper = container.querySelector("[data-vw-plugin-wrapper]");
			if (pluginWrapper) pluginWrapper.setAttribute("vw-plugin-wrapper", "");
		}

		if (!document.getElementById("vlibras-script")) {
			const script = document.createElement("script");
			script.id = "vlibras-script";
			script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
			script.async = true;
			script.onload = () => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				new (window as any).VLibras.Widget("https://vlibras.gov.br/app");
			};
			document.body.appendChild(script);
		}
		// Do NOT remove the script on unmount!
	}, []);

	return (
		<div ref={containerRef} className="enabled">
			<div data-vw-access-button className="active"></div>
			<div data-vw-plugin-wrapper>
				<div className="vw-plugin-top-wrapper"></div>
			</div>
		</div>
	);
}