import AddDestination from "../components/NewDestination";
import DisplayDestinations from "../components/DisplayDestinations";
import { Header } from "../components/Header";

export function Home() {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                width: "100vw",
                minHeight: "100vh",
                paddingBottom: "50px",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 50,
                boxSizing: "border-box",
            }}
        >
            <Header />
            <DisplayDestinations />
            <AddDestination />
        </div>
    );
}
