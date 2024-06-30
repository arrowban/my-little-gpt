ARG CUDA_IMAGE="12.5.0-devel-ubuntu22.04"
FROM nvidia/cuda:${CUDA_IMAGE}

RUN apt-get update && apt-get upgrade -y \
    && apt-get install -y git build-essential \
    python3 python3-pip gcc wget \
    ocl-icd-opencl-dev opencl-headers clinfo \
    libclblast-dev libopenblas-dev \
    && mkdir -p /etc/OpenCL/vendors && echo "libnvidia-opencl.so.1" > /etc/OpenCL/vendors/nvidia.icd

COPY requirements.txt .

ENV CUDA_DOCKER_ARCH=all
ENV LLAMA_CUBLAS=1

RUN python3 -m pip install -r requirements.txt --upgrade --force-reinstall --no-cache-dir

RUN CMAKE_ARGS="-DLLAMA_CUBLAS=on" pip install llama-cpp-python --upgrade --force-reinstall --no-cache-dir

COPY config.json .

ENV HF_HOME=/app/huggingface

ENV HOST 0.0.0.0
EXPOSE 8000

CMD ["python3", "-m", "llama_cpp.server", "--config_file", "config.json"]
