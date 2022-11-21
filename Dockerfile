FROM --platform=$BUILDPLATFORM node:18.9-alpine3.15 AS client-builder
WORKDIR /ui
# cache packages in layer
COPY ui/package.json /ui/package.json
COPY ui/package-lock.json /ui/package-lock.json
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci
# install
COPY ui /ui
RUN npm run build

FROM alpine
LABEL org.opencontainers.image.title="Image Puller" \
    org.opencontainers.image.description="Pull images through the Docker Desktop GUI" \
    org.opencontainers.image.vendor="IndieBits.io" \
    com.docker.desktop.extension.api.version="0.3.0" \
    com.docker.desktop.extension.icon="https://raw.githubusercontent.com/indiebits-io/image-puller-extension/main/indiebits_logo.svg" \
    com.docker.extension.screenshots='[{"alt":"text box and button to pull image", "url":"https://raw.githubusercontent.com/indiebits-io/image-puller-extension/main/screenshots/screenshot1.png"}]' \
    com.docker.extension.detailed-description="Very simple extension that provides a way to pull Docker images from remote repositories without needing to use the command line." \
    com.docker.extension.publisher-url="https://forum.indiebits.io" \
    com.docker.extension.additional-urls='[{"title":"Support","url":"https://forum.indiebits.io/"}' \
    com.docker.extension.changelog="Initial release" \
    com.docker.extension.categories="utility-tools"

#COPY --from=builder /backend/bin/service /
COPY docker-compose.yaml .
COPY metadata.json .
COPY indiebits_logo.svg .
COPY --from=client-builder /ui/build ui
CMD /service -socket /run/guest-services/extension-image-puller-extension.sock
