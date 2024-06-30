FROM python:3-slim-bullseye

WORKDIR /app

RUN apt update && apt install -y libopenblas-dev ninja-build build-essential pkg-config

COPY requirements.txt .

RUN python -m pip install -r requirements.txt --upgrade --force-reinstall --no-cache-dir

RUN CMAKE_ARGS="-DLLAMA_BLAS=ON -DLLAMA_BLAS_VENDOR=OpenBLAS" \
  pip install llama-cpp-python --upgrade --force-reinstall --no-cache-dir

COPY config.json .

ENV HF_HOME=/app/huggingface

ENV HOST 0.0.0.0
EXPOSE 8000

CMD ["python", "-m", "llama_cpp.server", "--config_file", "config.json"]
