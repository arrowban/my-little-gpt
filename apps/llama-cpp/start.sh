#!/bin/bash

source .venv/bin/activate

export HF_HOME=huggingface

python -m llama_cpp.server --config_file config.json
