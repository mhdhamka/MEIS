import { useParams } from "react-router-dom";
import CandidateProfile from "../components/candidates/CandidateProfile";
import { useCandidateData } from "../hooks/useCandidateData";

export default function CandidateDetail() {
    const { candidateId } = useParams();

    const {
        selectedCandidate,
        loading,
        error,
    } = useCandidateData(candidateId);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-40 animate-pulse rounded-lg bg-slate-100" />

                <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
                    <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
                    <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <h2 className="font-bold text-red-800">
                    Candidate Profile Unavailable
                </h2>

                <p className="mt-1 text-sm text-red-700">
                    {error}
                </p>
            </div>
        );
    }

    return (
        <CandidateProfile
            candidate={selectedCandidate}
        />
    );
}