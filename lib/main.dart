import 'package:flutter/material.dart';
import 'package:photo_view/photo_view.dart';
import 'dart:js_interop';
import 'dart:js_interop_unsafe';

void main() {
  final imageUrl = globalContext.getProperty<JSString?>('bobinesImageUrl'.toJS)?.toDart;
  if (imageUrl == null || imageUrl.isEmpty) return;
  runApp(BobinesApp(imageUrl: imageUrl));
}

class BobinesApp extends StatelessWidget {
  const BobinesApp({super.key, required this.imageUrl});
  final String imageUrl;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Bobines DA',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF0B2948)),
      ),
      home: GuiaBobinesPage(imageUrl: imageUrl),
    );
  }
}

class GuiaBobinesPage extends StatelessWidget {
  const GuiaBobinesPage({super.key, required this.imageUrl});
  final String imageUrl;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FB),
      body: SafeArea(
        child: PhotoView(
          imageProvider: NetworkImage(imageUrl),
          backgroundDecoration: const BoxDecoration(color: Color(0xFFF4F7FB)),
          initialScale: PhotoViewComputedScale.contained,
          minScale: PhotoViewComputedScale.contained,
          maxScale: PhotoViewComputedScale.covered * 5.0,
          basePosition: Alignment.topCenter,
          enableRotation: false,
          filterQuality: FilterQuality.high,
          gaplessPlayback: true,
        ),
      ),
    );
  }
}
