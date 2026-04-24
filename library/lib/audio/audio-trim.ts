type TrimAudioOptions = {
  audioFile: File;
  startTime: number;
  endTime: number;
};

export async function trimAudioFile({
  audioFile,
  startTime,
  endTime,
}: TrimAudioOptions): Promise<File> {
  const arrayBuffer = await audioFile.arrayBuffer();
  const AudioContextCtor =
    window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) {
    throw new Error("AudioContext is not supported in this browser.");
  }
  const audioContext = new AudioContextCtor();

  try {
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const safeStart = Math.max(0, Math.min(audioBuffer.duration, startTime));
    const safeEnd = Math.max(
      safeStart,
      Math.min(audioBuffer.duration, endTime)
    );

    if (safeEnd <= safeStart) {
      throw new Error("Invalid trim range");
    }

    const sampleRate = audioBuffer.sampleRate;
    const startSample = Math.floor(safeStart * sampleRate);
    const endSample = Math.floor(safeEnd * sampleRate);
    const length = endSample - startSample;

    const trimmedBuffer = audioContext.createBuffer(
      audioBuffer.numberOfChannels,
      length,
      sampleRate
    );

    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const channelData = audioBuffer.getChannelData(channel);
      const trimmedData = trimmedBuffer.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        trimmedData[i] = channelData[startSample + i];
      }
    }

    const wav = audioBufferToWav(trimmedBuffer);
    const blob = new Blob([wav], { type: "audio/wav" });
    return new File([blob], audioFile.name.replace(/\.[^/.]+$/, ".wav"), {
      type: "audio/wav",
    });
  } finally {
    audioContext.close().catch(() => {
      // ignore
    });
  }
}

export async function trimAudioToDuration(
  audioFile: File,
  durationSeconds: number
): Promise<File> {
  return trimAudioFile({ audioFile, startTime: 0, endTime: durationSeconds });
}

function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const length = buffer.length;
  const numberOfChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
  const view = new DataView(arrayBuffer);
  const channels: Float32Array[] = [];

  for (let i = 0; i < numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + length * numberOfChannels * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numberOfChannels * 2, true);
  view.setUint16(32, numberOfChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, length * numberOfChannels * 2, true);

  let offset = 44;
  for (let i = 0; i < length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      let sample = Math.max(-1, Math.min(1, channels[channel][i]));
      sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, sample, true);
      offset += 2;
    }
  }

  return arrayBuffer;
}
