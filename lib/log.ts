interface NewLogActionRequest {
    userEmail: string;
    action: string;
    metadata?: object;
}

export function log(email: string, action: string, metadata?: object) {
    const req: NewLogActionRequest = {
        userEmail: email,
        action,
    };
    if (metadata) req.metadata = metadata;
    fetch("/api/log", {
        method: "POST",
        body: JSON.stringify(req),
        })
}
